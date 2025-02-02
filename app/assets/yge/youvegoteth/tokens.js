/* eslint-disable nonblock-statement-body-position */
var tokens = function(network_id) {
  // from https://github.com/etherdelta/etherdelta.github.io/blob/master/config/main.json
  var _tokens = null;

  if (network_id == 'mainnet') {
    _tokens = [
      // non-etherdelta tokens
      {'addr': '0xe635c6d338dcd31c979b88000ff97c1fa3f0472c', 'name': 'GIT', 'decimals': 18},
      {'addr': '0x2941deaad71adb02b944bd38ebce2f1f4c9a62dc', 'name': 'COLO', 'decimals': 18},
      // from https://github.com/etherdelta/etherdelta.github.io/blob/master/config/main.json
      {'addr': '0x0000000000000000000000000000000000000000', 'name': 'ETH', 'decimals': 18},
      {'addr': '0xd8912c10681d8b21fd3742244f44658dba12264e', 'name': 'PLU', 'decimals': 18},
      {'addr': '0xaf30d2a7e90d7dc361c8c4585e9bb7d2f6f15bc7', 'name': '1ST', 'decimals': 18},
      {'addr': '0x936f78b9852d12f5cb93177c1f84fb8513d06263', 'name': 'GNTW', 'decimals': 18},
      {'addr': '0x01afc37f4f85babc47c0e2d0eababc7fb49793c8', 'name': 'GNTM', 'decimals': 18},
      {'addr': '0xa74476443119a942de498590fe1f2454d7d4ac0d', 'name': 'GNT', 'decimals': 18},
      {'addr': '0x5c543e7ae0a1104f78406c340e9c64fd9fce5170', 'name': 'VSL', 'decimals': 18},
      {'addr': '0xac709fcb44a43c35f0da4e3163b117a17f3770f5', 'name': 'ARC', 'decimals': 18},
      {'addr': '0x14f37b574242d366558db61f3335289a5035c506', 'name': 'HKG', 'decimals': 3},
      {'addr': '0x888666ca69e0f178ded6d75b5726cee99a87d698', 'name': 'ICN', 'decimals': 18},
      {'addr': '0xe94327d07fc17907b4db788e5adf2ed424addff6', 'name': 'REP', 'decimals': 18},
      {'addr': '0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009', 'name': 'SNGLS', 'decimals': 0},
      {'addr': '0x4df812f6064def1e5e029f1ca858777cc98d2d81', 'name': 'XAUR', 'decimals': 8},
      {'addr': '0xc66ea802717bfb9833400264dd12c2bceaa34a6d', 'name': 'MKR', 'decimals': 18},
      {'addr': '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a', 'name': 'DGD', 'decimals': 9},
      {'addr': '0xce3d9c3f3d302436d12f18eca97a3b00e97be7cd', 'name': 'EPOSY', 'decimals': 18},
      {'addr': '0x289fe11c6f46e28f9f1cfc72119aee92c1da50d0', 'name': 'EPOSN', 'decimals': 18},
      {'addr': '0x55e7c4a77821d5c50b4570b08f9f92896a25e012', 'name': 'P+', 'decimals': 0},
      {'addr': '0x45e42d659d9f9466cd5df622506033145a9b89bc', 'name': 'NXC', 'decimals': 3},
      {'addr': '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6', 'name': 'DCN', 'decimals': 0},
      {'addr': '0xb9e7f8568e08d5659f5d29c4997173d84cdf2607', 'name': 'SWT', 'decimals': 18},
      {'addr': '0xb802b24e0637c2b87d2e8b7784c055bbe921011a', 'name': 'EMV', 'decimals': 2},
      {'addr': '0x6531f133e6deebe7f2dce5a0441aa7ef330b4e53', 'name': 'TIME', 'decimals': 8},
      {'addr': '0xbeb9ef514a379b997e0798fdcc901ee474b6d9a1', 'name': 'MLN', 'decimals': 18},
      {'addr': '0x168296bb09e24a88805cb9c33356536b980d3fc5', 'name': 'RHOC', 'decimals': 8},
      {'addr': '0x08711d3b02c8758f2fb3ab4e80228418a7f8e39c', 'name': 'EDG', 'decimals': 0},
      {'addr': '0xf7b098298f7c69fc14610bf71d5e02c60792894c', 'name': 'GUP', 'decimals': 3},
      {'addr': '0x807b9487aaf00629b674bd6d02e4917453bc5939', 'name': 'ETB-OLD', 'decimals': 12},
      {'addr': '0x4fe6ea636abe664e0268af373a10ca3621a0b95b', 'name': 'ETB-OLD2', 'decimals': 12},
      {'addr': '0x607f4c5bb672230e8672085532f7e901544a7375', 'name': 'RLC', 'decimals': 9},
      {'addr': '0xcb94be6f13a1182e4a4b6140cb7bf2025d28e41b', 'name': 'TRST', 'decimals': 6},
      {'addr': '0x2e071d2966aa7d8decb1005885ba1977d6038a65', 'name': 'DICE', 'decimals': 16},
      {'addr': '0xe7775a6e9bcf904eb39da2b68c5efb4f9360e08c', 'name': 'TAAS', 'decimals': 6},
      {'addr': '0x6810e776880c02933d47db1b9fc05908e5386b96', 'name': 'GNO', 'decimals': 18},
      {'addr': '0x667088b212ce3d06a1b553a7221e1fd19000d9af', 'name': 'WINGS', 'decimals': 18},
      {'addr': '0xfa05a73ffe78ef8f1a739473e462c54bae6567d9', 'name': 'LUN', 'decimals': 18},
      {'addr': '0xaaaf91d9b90df800df4f55c205fd6989c977e73a', 'name': 'TKN', 'decimals': 8},
      {'addr': '0xcbcc0f036ed4788f63fc0fee32873d6a7487b908', 'name': 'HMQ', 'decimals': 8},
      {'addr': '0x960b236a07cf122663c4303350609a66a7b288c0', 'name': 'ANT', 'decimals': 18},
      {'addr': '0xd248b0d48e44aaf9c49aea0312be7e13a6dc1468', 'name': 'SGT', 'decimals': 1},
      {'addr': '0xff3519eeeea3e76f1f699ccce5e23ee0bdda41ac', 'name': 'BCAP', 'decimals': 0},
      {'addr': '0x0d8775f648430679a709e98d2b0cb6250d2887ef', 'name': 'BAT', 'decimals': 18},
      {'addr': '0xa645264c5603e96c3b0b078cdab68733794b0a71', 'name': 'MYST', 'decimals': 8},
      {'addr': '0x82665764ea0b58157e1e5e9bab32f68c76ec0cdf', 'name': 'VSM', 'decimals': 0},
      {'addr': '0x12fef5e57bf45873cd9b62e9dbd7bfb99e32d73e', 'name': 'CFI', 'decimals': 18},
      {'addr': '0x8f3470a7388c05ee4e7af3d01d8c722b0ff52374', 'name': 'VERI', 'decimals': 18},
      {'addr': '0x40395044ac3c0c57051906da938b54bd6557f212', 'name': 'MGO', 'decimals': 8},
      {'addr': '0x8ae4bf2c33a8e667de34b54938b0ccd03eb8cc06', 'name': 'PTOY', 'decimals': 8},
      {'addr': '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', 'name': 'BNT', 'decimals': 18},
      {'addr': '0x697beac28B09E122C4332D163985e8a73121b97F', 'name': 'QRL', 'decimals': 8},
      {'addr': '0xae616e72d3d89e847f74e8ace41ca68bbf56af79', 'name': 'GOOD', 'decimals': 6},
      {'addr': '0x744d70fdbe2ba4cf95131626614a1763df805b9e', 'name': 'SNT', 'decimals': 18},
      {'addr': '0x983f6d60db79ea8ca4eb9968c6aff8cfa04b3c63', 'name': 'SONM', 'decimals': 18},
      {'addr': '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671', 'name': 'NMR', 'decimals': 18},
      {'addr': '0x93e682107d1e9defb0b5ee701c71707a4b2e46bc', 'name': 'MCAP', 'decimals': 8},
      {'addr': '0xb97048628db6b661d4c2aa833e95dbe1a905b280', 'name': 'PAY', 'decimals': 18},
      {'addr': '0x5a84969bb663fb64f6d015dcf9f622aedc796750', 'name': 'ICE', 'decimals': 18},
      {'addr': '0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a', 'name': 'PPT', 'decimals': 8},
      {'addr': '0xbbb1bd2d741f05e144e6c4517676a15554fd4b8d', 'name': 'FUNOLD', 'decimals': 8},
      {'addr': '0x419d0d8bdd9af5e606ae2232ed285aff190e711b', 'name': 'FUN', 'decimals': 8},
      {'addr': '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd', 'name': 'ADT', 'decimals': 9},
      {'addr': '0xce5c603c78d047ef43032e96b5b785324f753a4f', 'name': 'E4ROW', 'decimals': 2},
      {'addr': '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac', 'name': 'STORJ', 'decimals': 8},
      {'addr': '0xcfb98637bcae43c13323eaa1731ced2b716962fd', 'name': 'NET', 'decimals': 18},
      {'addr': '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0', 'name': 'EOS', 'decimals': 18},
      {'addr': '0x4470bb87d77b963a013db939be332f927f2b992e', 'name': 'ADX', 'decimals': 4},
      {'addr': '0x621d78f2ef2fd937bfca696cabaf9a779f59b3ed', 'name': 'DRP', 'decimals': 2},
      {'addr': '0x8aa33a7899fcc8ea5fbe6a608a109c3893a1b8b2', 'name': 'BET', 'decimals': 18},
      {'addr': '0x0affa06e7fbe5bc9a764c979aa66e8256a631f02', 'name': 'PLBT', 'decimals': 6},
      {'addr': '0xd26114cd6ee289accf82350c8d8487fedb8a0c07', 'name': 'OMG', 'decimals': 18},
      {'addr': '0xb8c77482e45f1f44de1745f52c74426c631bdd52', 'name': 'BNB', 'decimals': 18},
      {'addr': '0x814964b1bceaf24e26296d031eadf134a2ca4105', 'name': 'NEWB', 'decimals': 0},
      {'addr': '0xb24754be79281553dc1adc160ddf5cd9b74361a4', 'name': 'XRL', 'decimals': 9},
      {'addr': '0x386467f1f3ddbe832448650418311a479eecfc57', 'name': 'EMB', 'decimals': 0},
      {'addr': '0xf433089366899d83a9f26a773d59ec7ecf30355e', 'name': 'MTL', 'decimals': 8},
      {'addr': '0xc63e7b1dece63a77ed7e4aeef5efb3b05c81438d', 'name': 'FUCKOLD', 'decimals': 4},
      {'addr': '0xab16e0d25c06cb376259cc18c1de4aca57605589', 'name': 'FUCK', 'decimals': 4},
      {'addr': '0x5c6183d10a00cd747a6dbb5f658ad514383e9419', 'name': 'NXX', 'decimals': 8},
      {'addr': '0xd5b9a2737c9b2ff35ecb23b884eb039303bbbb61', 'name': 'BTH', 'decimals': 18},
      {'addr': '0xe3818504c1b32bf1557b16c238b2e01fd3149c17', 'name': 'PLR', 'decimals': 18},
      {'addr': '0x41e5560054824ea6b0732e656e3ad64e20e94e45', 'name': 'CVC', 'decimals': 8},
      {'addr': '0xbfa4d71a51b9e0968be4bc299f8ba6cbb2f86789', 'name': 'MAYY', 'decimals': 18},
      {'addr': '0xab130bc7ff83192656a4b3079741c296615899c0', 'name': 'MAYN', 'decimals': 18},
      {'addr': '0xe2e6d4be086c6938b53b22144855eef674281639', 'name': 'LNK', 'decimals': 18},
      {'addr': '0x2bdc0d42996017fce214b21607a515da41a9e0c5', 'name': 'SKIN', 'decimals': 6},
      {'addr': '0x8b9c35c79af5319c70dd9a3e3850f368822ed64e', 'name': 'DGT', 'decimals': 18},
      {'addr': '0xa578acc0cb7875781b7880903f4594d13cfa8b98', 'name': 'ECN', 'decimals': 2},
      {'addr': '0x660b612ec57754d949ac1a09d0c2937a010dee05', 'name': 'BCD', 'decimals': 6},
      {'addr': '0x8ef59b92f21f9e5f21f5f71510d1a7f87a5420be', 'name': 'DEX', 'decimals': 2},
      {'addr': '0xea1f346faf023f974eb5adaf088bbcdf02d761f4', 'name': 'TIX', 'decimals': 18},
      {'addr': '0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af', 'name': 'CDT', 'decimals': 18},
      {'addr': '0xfca47962d45adfdfd1ab2d972315db4ce7ccf094', 'name': 'IXT', 'decimals': 8},
      {'addr': '0xa2f4fcb0fde2dd59f7a1873e121bc5623e3164eb', 'name': 'AIRA', 'decimals': 0},
      {'addr': '0x56ba2ee7890461f463f7be02aac3099f6d5811a8', 'name': 'CAT', 'decimals': 18},
      {'addr': '0x701c244b988a513c945973defa05de933b23fe1d', 'name': 'OAX', 'decimals': 18},
      {'addr': '0x08fd34559f2ed8585d3810b4d96ab8a05c9f97c5', 'name': 'CLRT', 'decimals': 18},
      {'addr': '0x68aa3f232da9bdc2343465545794ef3eea5209bd', 'name': 'MSP', 'decimals': 18},
      {'addr': '0x2a05d22db079bc40c2f77a1d1ff703a56e631cc1', 'name': 'BAS', 'decimals': 8},
      {'addr': '0xdc0c22285b61405aae01cba2530b6dd5cd328da7', 'name': 'KTN', 'decimals': 6},
      {'addr': '0xdd6bf56ca2ada24c683fac50e37783e55b57af9f', 'name': 'BNC', 'decimals': 12},
      {'addr': '0x0abdace70d3790235af448c88547603b945604ea', 'name': 'DNT', 'decimals': 18},
      {'addr': '0x9e77d5a1251b6f7d456722a6eac6d2d5980bd891', 'name': 'BRAT', 'decimals': 8},
      {'addr': '0x5af2be193a6abca9c8817001f45744777db30756', 'name': 'BQX', 'decimals': 8},
      {'addr': '0x006bea43baa3f7a6f765f14f10a1a1b08334ef45', 'name': 'STX', 'decimals': 18},
      {'addr': '0x88fcfbc22c6d3dbaa25af478c578978339bde77a', 'name': 'FYN', 'decimals': 18},
      {'addr': '0x4e0603e2a27a30480e5e3a4fe548e29ef12f64be', 'name': 'CREDO', 'decimals': 18},
      {'addr': '0x202e295df742befa5e94e9123149360db9d9f2dc', 'name': 'NIH', 'decimals': 8},
      {'addr': '0x671abbe5ce652491985342e85428eb1b07bc6c64', 'name': 'QAU', 'decimals': 8},
      {'addr': '0x3597bfd533a99c9aa083587b074434e61eb0a258', 'name': 'DENT', 'decimals': 8},
      {'addr': '0xbc7de10afe530843e71dfb2e3872405191e8d14a', 'name': 'SHOUC', 'decimals': 18},
      {'addr': '0x2ca72c9699b92b47272c9716c664cad6167c80b0', 'name': 'GUNS', 'decimals': 18},
      {'addr': '0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098', 'name': 'SAN', 'decimals': 18},
      {'addr': '0xf8e386eda857484f5a12e4b5daa9984e06e73705', 'name': 'IND', 'decimals': 18},
      {'addr': '0xfb12e3cca983b9f59d90912fd17f8d745a8b2953', 'name': 'LUCK', 'decimals': 0},
      {'addr': '0x0b1724cc9fda0186911ef6a75949e9c0d3f0f2f3', 'name': 'RIYA', 'decimals': 8},
      {'addr': '0xe41d2489571d322189246dafa5ebde1f4699f498', 'name': 'ZRX', 'decimals': 18},
      {'addr': '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d', 'name': 'MCO', 'decimals': 8},
      {'addr': '0x02b9806a64cb05f02aa8dcc1c178b88159a61304', 'name': 'DEL', 'decimals': 18},
      {'addr': '0x46492473755e8df960f8034877f61732d718ce96', 'name': 'STRC', 'decimals': 8},
      {'addr': '0x025abad9e518516fdaafbdcdb9701b37fb7ef0fa', 'name': 'GTKT', 'decimals': 0},
      {'addr': '0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195', 'name': 'POE', 'decimals': 8},
      {'addr': '0x38968746147bbaeb882f356ad9a57594bb158235', 'name': 'BENJA', 'decimals': 8},
      {'addr': '0x814cafd4782d2e728170fda68257983f03321c58', 'name': 'IDEA', 'decimals': 0},
      {'addr': '0x84119cb33e8f590d75c2d6ea4e6b0741a7494eda', 'name': 'WTT', 'decimals': 0},
      {'addr': '0x5ddab66da218fb05dfeda07f1afc4ea0738ee234', 'name': 'RARE', 'decimals': 8},
      {'addr': '0xd7631787b4dcc87b1254cfd1e5ce48e96823dee8', 'name': 'SCL', 'decimals': 8},
      {'addr': '0xa7f976c360ebbed4465c2855684d1aae5271efa9', 'name': 'TFL', 'decimals': 8},
      {'addr': '0x7654915a1b82d6d2d0afc37c52af556ea8983c7e', 'name': 'IFT', 'decimals': 18},
      {'addr': '0x94298f1e0ab2dfad6eeffb1426846a3c29d98090', 'name': 'MyB', 'decimals': 8},
      {'addr': '0x4355fc160f74328f9b383df2ec589bb3dfd82ba0', 'name': 'OPT', 'decimals': 18},
      {'addr': '0x17fd666fa0784885fa1afec8ac624d9b7e72b752', 'name': 'FLIK', 'decimals': 14},
      {'addr': '0x7288c72af505e3a6ff2712699e2a695465d353b3', 'name': 'MTP', 'decimals': 18},
      {'addr': '0x422866a8f0b032c5cf1dfbdef31a20f4509562b0', 'name': 'ADST', 'decimals': 0},
      {'addr': '0x66497a283e0a007ba3974e837784c6ae323447de', 'name': 'PT', 'decimals': 0},
      {'addr': '0x07d9e49ea402194bf48a8276dafb16e4ed633317', 'name': 'DALC', 'decimals': 8},
      {'addr': '0xcc4ef9eeaf656ac1a2ab886743e98e97e090ed38', 'name': 'DDF', 'decimals': 18},
      {'addr': '0xef68e7c694f40c8202821edf525de3782458639f', 'name': 'LRC', 'decimals': 18},
      {'addr': '0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244', 'name': 'RVT', 'decimals': 18},
      {'addr': '0x8a187d5285d316bcbc9adafc08b51d70a0d8e000', 'name': 'SIFT', 'decimals': 0},
      {'addr': '0x8effd494eb698cc399af6231fccd39e08fd20b15', 'name': 'PIX', 'decimals': 0},
      {'addr': '0xaa26b73bfdc80b5c7d2cfbfc30930038fb7fa657', 'name': 'TOV', 'decimals': 0},
      {'addr': '0x08f5a9235b08173b7569f83645d2c7fb55e8ccd8', 'name': 'TNT', 'decimals': 8},
      {'addr': '0x96a65609a7b84e8842732deb08f56c3e21ac6f8a', 'name': 'CTR', 'decimals': 18},
      {'addr': '0xe6923e9b56db1eed1c9f430ea761da7565e260fe', 'name': 'FC', 'decimals': 2},
      {'addr': '0xd850942ef8811f2a866692a623011bde52a462c1', 'name': 'VEN', 'decimals': 18},
      {'addr': '0x2160e6c0ae8ca7d62fe1f57fc049f8363283ff5f', 'name': 'BPT', 'decimals': 18},
      {'addr': '0xf05a9382a4c3f29e2784502754293d88b835109c', 'name': 'REX', 'decimals': 18},
      {'addr': '0x73dd069c299a5d691e9836243bcaec9c8c1d8734', 'name': 'BTE', 'decimals': 8},
      {'addr': '0x1bcbc54166f6ba149934870b60506199b6c9db6d', 'name': 'ROC', 'decimals': 10},
      {'addr': '0x27f706edde3ad952ef647dd67e24e38cd0803dd6', 'name': 'UET', 'decimals': 18},
      {'addr': '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', 'name': 'MANA', 'decimals': 18},
      {'addr': '0xc0e4f45b828aa4aa628e897e5da38d9dc72c2257', 'name': 'KC', 'decimals': 8},
      {'addr': '0x4e260e3ca268e40133c84b142de73108a7c1ec99', 'name': 'YC', 'decimals': 0},
      {'addr': '0xaf4dce16da2877f8c9e00544c93b62ac40631f16', 'name': 'MTH', 'decimals': 5},
      {'addr': '0x9214ec02cb71cba0ada6896b8da260736a67ab10', 'name': 'REAL', 'decimals': 18},
      {'addr': '0xe5a7c12972f3bbfe70ed29521c8949b8af6a0970', 'name': 'BLX', 'decimals': 18},
      {'addr': '0x5cf4e9dfd975c52aa523fb5945a12235624923dc', 'name': 'MPRM', 'decimals': 0},
      {'addr': '0xb581e3a7db80fbaa821ab39342e9cbfd2ce33c23', 'name': 'ARCD', 'decimals': 18},
      {'addr': '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6', 'name': 'RDN', 'decimals': 18},
      {'addr': '0x056017c55aE7AE32d12AeF7C679dF83A85ca75Ff', 'name': 'WYV', 'decimals': 18},
      {'addr': '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', 'name': 'DAI', 'decimals': 18},
      {'addr': '0xfa6f7881E52fDF912c4a285D78a3141B089cE859', 'name': 'AVO', 'decimals': 18},
      {'addr': '0x58b6a8a3302369daec383334672404ee733ab239', 'name': 'LPT', 'decimals': 18},
      {'addr': '0x09617f6fd6cf8a71278ec86e23bbab29c04353a7', 'name': 'ULT', 'decimals': 18},
      {'addr': '0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466', 'name': 'AION', 'decimals': 8},
      {'addr': '0x4162178B78D6985480A308B2190EE5517460406D', 'name': 'CLN', 'decimals': 18},
      {'addr': '0x7338809d1a2c6fbb6e755470ab2a28e8c5dac63c', 'name': 'OZR', 'decimals': 18},
      {'addr': '0xc324a2f6b05880503444451b8b27e6f9e63287cb', 'name': 'XUC', 'decimals': 18}
    ];
  } else if (network_id == 'ropsten') { // ropsten
    _tokens = [
      { 'addr': '0x0000000000000000000000000000000000000000', 'name': 'ETH', 'decimals': 18 },
      { 'addr': '0x2941deaad71adb02b944bd38ebce2f1f4c9a62dc', 'name': 'COLO', 'decimals': 18 },
      { 'addr': '0xeccb46ebe07c5a2b249586796f921ddfe0d46271', 'name': 'GIT', 'decimals': 18 },
      { 'addr': '0x41C9d91E96b933b74ae21bCBb617369CBE022530', 'name': 'CLN', 'decimals': 18 }
    ];
  } else if (network_id == 'custom network') { // testrpc
    _tokens = [
      { 'addr': '0x0000000000000000000000000000000000000000', 'name': 'ETH', 'decimals': 18 },
      { 'addr': '0x7dd4bfd96981573ce7dbcde779adcdf2d3039332', 'name': 'GIT', 'decimals': 18 }
    ];
  } else {
    _tokens = [
      { 'addr': '0x0000000000000000000000000000000000000000', 'name': 'ETH', 'decimals': 18 }
    ];
  }

  _tokens.sort(function(a, b) {
    if (a.name[0] < b.name[0]) {
      return -1;
    }
    return 1;
  });

  return _tokens;
};


var tokenAddressToDetails = function(addr) {
  var _tokens = tokens(document.web3network);

  for (var i = 0; i < _tokens.length; i += 1) {
    if (_tokens[i].addr == addr) {
      return _tokens[i];
    }
  }
  return null;
};
