# -*- coding: utf-8 -*-
'''
    Copyright (C) 2017 Gitcoin Core

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.

'''
import logging

from django.conf import settings
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.template.response import TemplateResponse
from django.utils import timezone
from django.utils.translation import gettext as _

import cssutils
import premailer
from marketing.utils import get_or_save_email_subscriber
from retail.utils import strip_double_chars, strip_html

# RENDERERS

# key, name, frequency
MARKETING_EMAILS = [
    ('roundup', _('Roundup Emails'), _('Weekly')),
    ('new_bounty_notifications', _('New Bounty Notification Emails'), _('(up to) Daily')),
    ('important_product_updates', _('Product Update Emails'), _('Quarterly')),
]

TRANSACTIONAL_EMAILS = [
    ('tip', _('Tip Emails'), _('Only when you are sent a tip')),
    ('faucet', _('Faucet Notification Emails'), _('Only when you are sent a faucet distribution')),
    ('bounty', _('Bounty Notification Emails'), _('Only when you\'re active on a bounty')),
    ('bounty_match', _('Bounty Match Emails'), _('Only when you\'ve posted a open bounty and you have a new match')),
    ('bounty_feedback', _('Bounty Feedback Emails'), _('Only after a bounty you participated in is finished.')),
    (
        'bounty_expiration', _('Bounty Expiration Warning Emails'),
        _('Only after you posted a bounty which is going to expire')
    ),
]

ALL_EMAILS = MARKETING_EMAILS + TRANSACTIONAL_EMAILS


def premailer_transform(html):
    cssutils.log.setLevel(logging.CRITICAL)
    return premailer.transform(html)


def render_tip_email(to_email, tip, is_new):
    warning = tip.network if tip.network != 'mainnet' else ""
    params = {
        'link': tip.url,
        'amount': round(tip.amount, 5),
        'tokenName': tip.tokenName,
        'comments_priv': tip.comments_priv,
        'comments_public': tip.comments_public,
        'tip': tip,
        'show_expires': tip.expires_date < (timezone.now() + timezone.timedelta(days=365)) and tip.expires_date,
        'is_new': is_new,
        'warning': warning,
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
        'is_sender': to_email not in tip.emails,
        'is_receiver': to_email in tip.emails,
    }

    response_html = premailer_transform(render_to_string("emails/new_tip.html", params))
    response_txt = render_to_string("emails/new_tip.txt", params)

    return response_html, response_txt


def render_match_email(bounty, github_username):
    params = {
        'bounty': bounty,
        'github_username': github_username,
    }
    response_html = premailer_transform(render_to_string("emails/new_match.html", params))
    response_txt = render_to_string("emails/new_match.txt", params)

    return response_html, response_txt


def render_quarterly_stats(to_email, platform_wide_stats):
    from dashboard.models import Profile
    profile = Profile.objects.filter(email=to_email).first()
    quarterly_stats = profile.get_quarterly_stats
    params = {**quarterly_stats, **platform_wide_stats}
    params['subscriber'] = get_or_save_email_subscriber(to_email, 'internal'),
    print(params)
    response_html = premailer_transform(render_to_string("emails/quarterly_stats.html", params))
    response_txt = render_to_string("emails/quarterly_stats.txt", params)

    return response_html, response_txt


def render_bounty_feedback(bounty, persona='submitter', previous_bounties=[]):
    previous_bounties_str = ", ".join([bounty.github_url for bounty in previous_bounties])
    if persona == 'fulfiller':
        accepted_fulfillments = bounty.fulfillments.filter(accepted=True)
        github_username = " @" + accepted_fulfillments.first().fulfiller_github_username if accepted_fulfillments.exists() and accepted_fulfillments.first().fulfiller_github_username else ""
        txt = f"""
hi{github_username},

thanks for turning around this bounty.  we're hyperfocused on making gitcoin a great place for blockchain developers to hang out, learn new skills, and make a little extra ETH.

in that spirit,  i have a few questions for you.

> what would you say your average hourly rate was for this bounty? {bounty.github_url}

> what was the best thing about working on the platform?  what was the worst?

> would you use gitcoin again?

thanks again for being a member of the community.

kevin

PS - i've got some new gitcoin schwag on order. send me your mailing address and your t shirt size and i'll ship you some.

"""
    elif persona == 'funder':
        github_username = " @" + bounty.bounty_owner_github_username if bounty.bounty_owner_github_username else ""
        if bounty.status == 'done':
            txt = f"""

hi{github_username},

thanks for putting this bounty ({bounty.github_url}) on gitcoin.  i'm glad to see it was turned around.

we're hyperfocused on making gitcoin a great place for blockchain developers to hang out, learn new skills, and make a little extra ETH.

in that spirit,  i have a few questions for you:

> how much coaching/communication did it take the counterparty to turn around the issue?  was this burdensome?

> what was the best thing about working on the platform?  what was the worst?

> would you use gitcoin again?

thanks for being a member of the community.

kevin

PS - i've got some new gitcoin schwag on order. send me your mailing address and your t shirt size and i'll ship you some.

"""
        elif bounty.status == 'cancelled':
            txt = f"""
hi{github_username},

we saw that you cancelled this bounty.

i was sorry to see that the bounty did not get done.

i have a few questions for you.

> why did you decide to cancel the bounty?

> would you use gitcoin again?

thanks again for being a member of the community.

kevin

PS - i've got some new gitcoin schwag on order. send me your mailing address and your t shirt size and i'll ship you some.

"""
        else:
            raise Exception('unknown bounty status')
    else:
        raise Exception('unknown persona')

    params = {
        'txt': txt,
    }
    response_html = premailer_transform(render_to_string("emails/txt.html", params))
    response_txt = txt

    return response_html, response_txt


def render_admin_contact_funder(bounty, text, from_user):
    txt = f"""
{bounty.url}

{text}

{from_user}

"""
    params = {
        'txt': txt,
    }
    response_html = premailer_transform(render_to_string("emails/txt.html", params))
    response_txt = txt

    return response_html, response_txt



def render_new_bounty(to_email, bounties, old_bounties):
    sub = get_or_save_email_subscriber(to_email, 'internal')
    params = {
        'old_bounties': old_bounties,
        'bounties': bounties,
        'subscriber': sub,
        'keywords': ",".join(sub.keywords),
    }

    response_html = premailer_transform(render_to_string("emails/new_bounty.html", params))
    response_txt = render_to_string("emails/new_bounty.txt", params)

    return response_html, response_txt


def render_gdpr_reconsent(to_email):
    sub = get_or_save_email_subscriber(to_email, 'internal')
    params = {
        'subscriber': sub,
    }

    response_html = premailer_transform(render_to_string("emails/gdpr_reconsent.html", params))
    response_txt = render_to_string("emails/gdpr_reconsent.txt", params)

    return response_html, response_txt


def render_new_work_submission(to_email, bounty):
    params = {
        'bounty': bounty,
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/new_work_submission.html", params))
    response_txt = render_to_string("emails/new_work_submission.txt", params)

    return response_html, response_txt


def render_new_bounty_acceptance(to_email, bounty):
    params = {
        'bounty': bounty,
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/new_bounty_acceptance.html", params))
    response_txt = render_to_string("emails/new_bounty_acceptance.txt", params)

    return response_html, response_txt


def render_new_bounty_rejection(to_email, bounty):
    params = {
        'bounty': bounty,
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/new_bounty_rejection.html", params))
    response_txt = render_to_string("emails/new_bounty_rejection.txt", params)

    return response_html, response_txt


def render_bounty_expire_warning(to_email, bounty):
    from django.db.models.functions import Lower

    unit = 'days'
    num = int(round((bounty.expires_date - timezone.now()).days, 0))
    if num == 0:
        unit = 'hours'
        num = int(round((bounty.expires_date - timezone.now()).seconds / 3600 / 24, 0))

    fulfiller_emails = list(bounty.fulfillments.annotate(lower_email=Lower('fulfiller_email')).values_list('lower_email'))

    params = {
        'bounty': bounty,
        'num': num,
        'unit': unit,
        'is_claimee': (to_email.lower() in fulfiller_emails),
        'is_owner': bounty.bounty_owner_email.lower() == to_email.lower(),
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/new_bounty_expire_warning.html", params))
    response_txt = render_to_string("emails/new_bounty_expire_warning.txt", params)

    return response_html, response_txt


def render_bounty_startwork_expire_warning(to_email, bounty, interest, time_delta_days):
    params = {
        'bounty': bounty,
        'interest': interest,
        'time_delta_days': time_delta_days,
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/bounty_startwork_expire_warning.html", params))
    response_txt = render_to_string("emails/bounty_startwork_expire_warning.txt", params)

    return response_html, response_txt


def render_bounty_unintersted(to_email, bounty, interest):
    params = {
        'bounty': bounty,
        'interest': interest,
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/bounty_uninterested.html", params))
    response_txt = render_to_string("emails/bounty_uninterested.txt", params)

    return response_html, response_txt


def render_faucet_rejected(fr):

    params = {
        'fr': fr,
        'amount': settings.FAUCET_AMOUNT,
        'subscriber': get_or_save_email_subscriber(fr.email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/faucet_request_rejected.html", params))
    response_txt = render_to_string("emails/faucet_request_rejected.txt", params)

    return response_html, response_txt


def render_faucet_request(fr):

    params = {
        'fr': fr,
        'amount': settings.FAUCET_AMOUNT,
        'subscriber': get_or_save_email_subscriber(fr.email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/faucet_request.html", params))
    response_txt = render_to_string("emails/faucet_request.txt", params)

    return response_html, response_txt


def render_bounty_startwork_expired(to_email, bounty, interest, time_delta_days):
    params = {
        'bounty': bounty,
        'interest': interest,
        'time_delta_days': time_delta_days,
        'subscriber': get_or_save_email_subscriber(fr.email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/render_bounty_startwork_expired.html", params))
    response_txt = render_to_string("emails/render_bounty_startwork_expired.txt", params)

    return response_html, response_txt


def render_gdpr_update(to_email):
    params = {
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
        'terms_of_use_link': 'https://gitcoin.co/legal/terms',
        'privacy_policy_link': 'https://gitcoin.co/legal/privacy',
        'cookie_policy_link': 'https://gitcoin.co/legal/cookie',
    }

    subject = "Gitcoin: Updated Terms & Policies"
    response_html = premailer_transform(render_to_string("emails/gdpr_update.html", params))
    response_txt = render_to_string("emails/gdpr_update.txt", params)

    return response_html, response_txt, subject


def render_start_work_approved(interest, bounty):
    to_email = interest.profile.email
    params = {
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
        'interest': interest,
        'bounty': bounty,
        'approve_worker_url': bounty.approve_worker_url(interest.profile.handle),
    }

    subject = "Request Accepted "
    response_html = premailer_transform(render_to_string("emails/start_work_approved.html", params))
    response_txt = render_to_string("emails/start_work_approved.txt", params)

    return response_html, response_txt, subject


def render_start_work_rejected(interest, bounty):
    to_email = interest.profile.email
    params = {
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
        'interest': interest,
        'bounty': bounty,
        'approve_worker_url': bounty.approve_worker_url(interest.profile.handle),
    }

    subject = "Work Request Denied"
    response_html = premailer_transform(render_to_string("emails/start_work_rejected.html", params))
    response_txt = render_to_string("emails/start_work_rejected.txt", params)

    return response_html, response_txt, subject


def render_start_work_new_applicant(interest, bounty):
    to_email = bounty.bounty_owner_email
    params = {
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
        'interest': interest,
        'bounty': bounty,
        'approve_worker_url': bounty.approve_worker_url(interest.profile.handle),
    }

    subject = "A new request to work on your bounty"
    response_html = premailer_transform(render_to_string("emails/start_work_new_applicant.html", params))
    response_txt = render_to_string("emails/start_work_new_applicant.txt", params)

    return response_html, response_txt, subject


def render_start_work_applicant_about_to_expire(interest, bounty):
    to_email = bounty.bounty_owner_email
    params = {
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
        'interest': interest,
        'bounty': bounty,
        'approve_worker_url': bounty.approve_worker_url(interest.profile.handle),
    }

    subject = "24 Hrs to Approve"
    response_html = premailer_transform(render_to_string("emails/start_work_applicant_about_to_expire.html", params))
    response_txt = render_to_string("emails/start_work_applicant_about_to_expire.txt", params)

    return response_html, response_txt, subject


def render_start_work_applicant_expired(interest, bounty):
    to_email = bounty.bounty_owner_email
    params = {
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
        'interest': interest,
        'bounty': bounty,
        'approve_worker_url': bounty.approve_worker_url(interest.profile.handle),
    }

    subject = "A Worker was Auto Approved"
    response_html = premailer_transform(render_to_string("emails/start_work_applicant_expired.html", params))
    response_txt = render_to_string("emails/start_work_applicant_expired.txt", params)

    return response_html, response_txt, subject


# ROUNDUP_EMAIL
def render_new_bounty_roundup(to_email):
    from dashboard.models import Bounty
    from external_bounties.models import ExternalBounty
    subject = "Gitcoin Q2 Update | Augur Testimonial"

    intro = '''

<p>
    Hi there
</p>
<p>
This week, we shipped <a href="https://medium.com/gitcoin/gitcoin-q2-update-c31e751889c8">Q2 updates.</a>
In this update, we discuss our OKR’s for Q2, how we performed, and our goals moving forward into Q3.
</p>

<p>
In addition to that, we highlighted <a href="https://medium.com/gitcoin/gitcoin-testimonials-augur-9bfe97368a30">
Augur's work on the Gitcoin platform.</a>
In this post, we briefly discuss what the goal of the Augur project is, how the team has used Gitcoin
to build it, and some specifics about the important bounties they’ve had completed by the Gitcoin community.
Special shout out to Tom Kysar and @cryptomental for their input on this one!
</p>

<p>
Finally, we pushed our
<a href="https://medium.com/p/804c18dc91da">second installment of Gitcoiner profiles.</a>
This weeks profile features UX ninja Will Goi. Will has worked closely with the Gitcoin team over the past
few months to help us build out design features such as the new user profile page and the funds requested interface.
</p>
<h3>What else is new?</h3>
    <ul>
        <li>
Our livestream recording featuring Andy Tudhope of Status has been added to the Gitcoin Youtube channel.
<a href="https://www.youtube.com/watch?v=JiL0aPao50I&t=13s">Check it out!</a>
        </li>
        <li>
<a href="https://gitcoin.co/livestream">The Gitcoin Livestream</a> is on as regularly scheduled today at 5PM ET.
This week features John Paller of Opolis!
        </li>

    </ul>
</p>
<p>
Back to building,
</p>
'''
    highlights = [
        {
            'who': 'subramanianv',
            'who_link': True,
            'what': 'Created a full test suite for Market Protocol’s Collateral.Ts',
            'link': 'https://gitcoin.co/issue/MARKETProtocol/MARKET.js/53/708',
            'link_copy': 'View more',
        },
        {
            'who': 'HPrivakos',
            'who_link': True,
            'what': 'Helped Decentraland create a tutorial for creating a static scene in their VR world.',
            'link': 'https://gitcoin.co/issue/decentraland/MANA-community-fund-learning-content/8/707',
            'link_copy': 'View more',
        },
        {
            'who': 'subramanianv',
            'who_link': True,
            'what': 'Also improved the Livepeer UX by alerting users when their funds are too low to broadcast.',
            'link': 'https://gitcoin.co/issue/livepeer/livepeerjs/125/703',
            'link_copy': 'View more',
        },
    ]

    bounties_spec = [
        {
            'url': 'https://github.com/MARKETProtocol/MARKET.js/issues/60',
            'primer': 'Help the Market Protocol team validate deposits and withdrawals before a transaction is created.',
        },
        {
            'url': 'https://github.com/MetaMask/metamask-extension/issues/4161',
            'primer': 'Contribute to MetaMask by building a feature for account and network changes when using a Web 3.0 plugin.',
        },
        {
            'url': 'https://github.com/rotkehlchenio/rotkehlchen/issues/28',
            'primer': 'Build out Windows support for the Rotkehlchen asset management platform.',
        },
    ]

    #### don't need to edit anything below this line

    bounties = []
    for nb in bounties_spec:
        try:
            bounty = Bounty.objects.get(
                current_bounty=True,
                github_url__iexact=nb['url'],
            )
            bounties.append({
                'obj': bounty,
                'primer': nb['primer']
                })
        except:
            pass

    ecosystem_bounties = ExternalBounty.objects.filter(created_on__gt=timezone.now() - timezone.timedelta(weeks=1)).order_by('?')[0:5]

    params = {
        'intro': intro,
        'intro_txt': strip_double_chars(strip_double_chars(strip_double_chars(strip_html(intro), ' '), "\n"), "\n "),
        'bounties': bounties,
        'ecosystem_bounties': ecosystem_bounties,
        'invert_footer': False,
        'hide_header': False,
        'highlights': highlights,
        'subscriber': get_or_save_email_subscriber(to_email, 'internal'),
    }

    response_html = premailer_transform(render_to_string("emails/bounty_roundup.html", params))
    response_txt = render_to_string("emails/bounty_roundup.txt", params)

    return response_html, response_txt, subject


# DJANGO REQUESTS


@staff_member_required
def new_tip(request):
    from dashboard.models import Tip
    tip = Tip.objects.last()
    response_html, _ = render_tip_email(settings.CONTACT_EMAIL, tip, True)

    return HttpResponse(response_html)


@staff_member_required
def new_match(request):
    from dashboard.models import Bounty
    response_html, _ = render_match_email(Bounty.objects.exclude(title='').last(), 'owocki')

    return HttpResponse(response_html)


@staff_member_required
def resend_new_tip(request):
    from dashboard.models import Tip
    from marketing.mails import tip_email
    pk = request.POST.get('pk', request.GET.get('pk'))
    params = {
        'pk': pk,
    }

    if request.POST.get('pk'):
        email = request.POST.get('email')

        if not pk or not email:
            messages.error(request, 'Not sent.  Invalid args.')
            return redirect('/_administration')

        tip = Tip.objects.get(pk=pk)
        tip.emails = tip.emails + [email]
        tip_email(tip, [email], True)
        tip.save()

        messages.success(request, 'Resend sent')

        return redirect('/_administration')

    return TemplateResponse(request, 'resend_tip.html', params)


@staff_member_required
def new_bounty(request):
    from dashboard.models import Bounty
    bounties = Bounty.objects.filter(current_bounty=True).order_by('-web3_created')[0:3]
    old_bounties = Bounty.objects.filter(current_bounty=True).order_by('-web3_created')[0:3]
    response_html, _ = render_new_bounty(settings.CONTACT_EMAIL, bounties, old_bounties)
    return HttpResponse(response_html)


@staff_member_required
def new_work_submission(request):
    from dashboard.models import Bounty
    bounty = Bounty.objects.filter(idx_status='submitted', current_bounty=True).last()
    response_html, _ = render_new_work_submission(settings.CONTACT_EMAIL, bounty)
    return HttpResponse(response_html)


@staff_member_required
def new_bounty_rejection(request):
    from dashboard.models import Bounty
    response_html, _ = render_new_bounty_rejection(settings.CONTACT_EMAIL, Bounty.objects.last())
    return HttpResponse(response_html)


@staff_member_required
def new_bounty_acceptance(request):
    from dashboard.models import Bounty
    response_html, _ = render_new_bounty_acceptance(settings.CONTACT_EMAIL, Bounty.objects.last())
    return HttpResponse(response_html)


@staff_member_required
def bounty_feedback(request):
    from dashboard.models import Bounty
    response_html, _ = render_bounty_feedback(Bounty.objects.filter(idx_status='done', current_bounty=True).last(), 'foo')
    return HttpResponse(response_html)


@staff_member_required
def bounty_expire_warning(request):
    from dashboard.models import Bounty
    response_html, _ = render_bounty_expire_warning(settings.CONTACT_EMAIL, Bounty.objects.last())
    return HttpResponse(response_html)


@staff_member_required
def start_work_expired(request):
    from dashboard.models import Bounty, Interest
    response_html, _ = render_bounty_startwork_expired(settings.CONTACT_EMAIL, Bounty.objects.last(), Interest.objects.all().last(), 5)
    return HttpResponse(response_html)


@staff_member_required
def start_work_expire_warning(request):
    from dashboard.models import Bounty, Interest
    response_html, _ = render_bounty_startwork_expire_warning(settings.CONTACT_EMAIL, Bounty.objects.last(), Interest.objects.all().last(), 5)
    return HttpResponse(response_html)


@staff_member_required
def faucet(request):
    from faucet.models import FaucetRequest
    fr = FaucetRequest.objects.last()
    response_html, _ = render_faucet_request(fr)
    return HttpResponse(response_html)


@staff_member_required
def faucet_rejected(request):
    from faucet.models import FaucetRequest
    fr = FaucetRequest.objects.exclude(comment_admin='').last()
    response_html, _ = render_faucet_rejected(fr)
    return HttpResponse(response_html)


@staff_member_required
def roundup(request):
    response_html, _, _ = render_new_bounty_roundup(settings.CONTACT_EMAIL)
    return HttpResponse(response_html)


@staff_member_required
def quarterly_roundup(request):
    from marketing.utils import get_platform_wide_stats
    platform_wide_stats = get_platform_wide_stats()
    response_html, _ = render_quarterly_stats(settings.CONTACT_EMAIL, platform_wide_stats)
    return HttpResponse(response_html)


@staff_member_required
def gdpr_reconsent(request):
    response_html, _ = render_gdpr_reconsent(settings.CONTACT_EMAIL)
    return HttpResponse(response_html)


@staff_member_required
def start_work_approved(request):
    from dashboard.models import Interest, Bounty
    interest = Interest.objects.last()
    bounty = Bounty.objects.last()
    response_html, _, _ = render_start_work_approved(interest, bounty)
    return HttpResponse(response_html)


@staff_member_required
def start_work_rejected(request):
    from dashboard.models import Interest, Bounty
    interest = Interest.objects.last()
    bounty = Bounty.objects.last()
    response_html, _, _ = render_start_work_rejected(interest, bounty)
    return HttpResponse(response_html)


@staff_member_required
def start_work_new_applicant(request):
    from dashboard.models import Interest, Bounty
    interest = Interest.objects.last()
    bounty = Bounty.objects.last()
    response_html, _, _ = render_start_work_new_applicant(interest, bounty)
    return HttpResponse(response_html)


@staff_member_required
def start_work_applicant_about_to_expire(request):
    from dashboard.models import Interest, Bounty
    interest = Interest.objects.last()
    bounty = Bounty.objects.last()
    response_html, _, _ = render_start_work_applicant_about_to_expire(interest, bounty)
    return HttpResponse(response_html)


@staff_member_required
def start_work_applicant_expired(request):
    from dashboard.models import Interest, Bounty
    interest = Interest.objects.last()
    bounty = Bounty.objects.last()
    response_html, _, _ = render_start_work_applicant_expired(interest, bounty)
    return HttpResponse(response_html)
