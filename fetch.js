const scripts = require("./script-list.json");
// const har = require("./har.json");
// const har1 = require("./har1.json");
const fs = require("fs");
const pLimit = require("p-limit").default;

const limit = pLimit(10);

console.log("当前总数：", scripts.length);

function getScriptDetail(scriptId) {
  const targetScript = scripts.find((s) => s.scriptId === scriptId);
  if (targetScript) {
    console.log(`[${targetScript.scriptName}] 已存在，跳过`);
    return;
  }
  function hex(t, e = 32) {
    function r(t, e) {
      return (t << e) | (t >>> (32 - e));
    }
    function o(t, e) {
      var r, o, i, n, a;
      return (
        (i = 2147483648 & t),
        (n = 2147483648 & e),
        (r = 1073741824 & t),
        (o = 1073741824 & e),
        (a = (1073741823 & t) + (1073741823 & e)),
        r & o
          ? 2147483648 ^ a ^ i ^ n
          : r | o
          ? 1073741824 & a
            ? 3221225472 ^ a ^ i ^ n
            : 1073741824 ^ a ^ i ^ n
          : a ^ i ^ n
      );
    }
    function i(t, e, i, n, a, u, l) {
      return (
        (t = o(
          t,
          o(
            o(
              (function (t, e, r) {
                return (t & e) | (~t & r);
              })(e, i, n),
              a
            ),
            l
          )
        )),
        o(r(t, u), e)
      );
    }
    function n(t, e, i, n, a, u, l) {
      return (
        (t = o(
          t,
          o(
            o(
              (function (t, e, r) {
                return (t & r) | (e & ~r);
              })(e, i, n),
              a
            ),
            l
          )
        )),
        o(r(t, u), e)
      );
    }
    function a(t, e, i, n, a, u, l) {
      return (
        (t = o(
          t,
          o(
            o(
              (function (t, e, r) {
                return t ^ e ^ r;
              })(e, i, n),
              a
            ),
            l
          )
        )),
        o(r(t, u), e)
      );
    }
    function u(t, e, i, n, a, u, l) {
      return (
        (t = o(
          t,
          o(
            o(
              (function (t, e, r) {
                return e ^ (t | ~r);
              })(e, i, n),
              a
            ),
            l
          )
        )),
        o(r(t, u), e)
      );
    }
    function l(t) {
      var e,
        r,
        o = "",
        i = "";
      for (r = 0; r <= 3; r++)
        (e = (t >>> (8 * r)) & 255),
          (i = "0" + e.toString(16)),
          (o += i.substr(i.length - 2, 2));
      return o;
    }
    var d,
      h,
      c,
      p,
      s,
      f,
      g,
      v,
      S,
      m = Array();
    for (
      t = (function (t) {
        t = t.replace(/\r\n/g, "\n");
        for (var e = "", r = 0; r < t.length; r++) {
          var o = t.charCodeAt(r);
          o < 128
            ? (e += String.fromCharCode(o))
            : o > 127 && o < 2048
            ? ((e += String.fromCharCode((o >> 6) | 192)),
              (e += String.fromCharCode((63 & o) | 128)))
            : ((e += String.fromCharCode((o >> 12) | 224)),
              (e += String.fromCharCode(((o >> 6) & 63) | 128)),
              (e += String.fromCharCode((63 & o) | 128)));
        }
        return e;
      })(t),
        m = (function (t) {
          var e,
            r = t.length,
            o = r + 8,
            i = (o - (o % 64)) / 64,
            n = 16 * (i + 1),
            a = Array(n - 1),
            u = 0,
            l = 0;
          while (l < r)
            (e = (l - (l % 4)) / 4),
              (u = (l % 4) * 8),
              (a[e] = a[e] | (t.charCodeAt(l) << u)),
              l++;
          return (
            (e = (l - (l % 4)) / 4),
            (u = (l % 4) * 8),
            (a[e] = a[e] | (128 << u)),
            (a[n - 2] = r << 3),
            (a[n - 1] = r >>> 29),
            a
          );
        })(t),
        f = 1732584193,
        g = 4023233417,
        v = 2562383102,
        S = 271733878,
        d = 0;
      d < m.length;
      d += 16
    )
      (h = f),
        (c = g),
        (p = v),
        (s = S),
        (f = i(f, g, v, S, m[d + 0], 7, 3614090360)),
        (S = i(S, f, g, v, m[d + 1], 12, 3905402710)),
        (v = i(v, S, f, g, m[d + 2], 17, 606105819)),
        (g = i(g, v, S, f, m[d + 3], 22, 3250441966)),
        (f = i(f, g, v, S, m[d + 4], 7, 4118548399)),
        (S = i(S, f, g, v, m[d + 5], 12, 1200080426)),
        (v = i(v, S, f, g, m[d + 6], 17, 2821735955)),
        (g = i(g, v, S, f, m[d + 7], 22, 4249261313)),
        (f = i(f, g, v, S, m[d + 8], 7, 1770035416)),
        (S = i(S, f, g, v, m[d + 9], 12, 2336552879)),
        (v = i(v, S, f, g, m[d + 10], 17, 4294925233)),
        (g = i(g, v, S, f, m[d + 11], 22, 2304563134)),
        (f = i(f, g, v, S, m[d + 12], 7, 1804603682)),
        (S = i(S, f, g, v, m[d + 13], 12, 4254626195)),
        (v = i(v, S, f, g, m[d + 14], 17, 2792965006)),
        (g = i(g, v, S, f, m[d + 15], 22, 1236535329)),
        (f = n(f, g, v, S, m[d + 1], 5, 4129170786)),
        (S = n(S, f, g, v, m[d + 6], 9, 3225465664)),
        (v = n(v, S, f, g, m[d + 11], 14, 643717713)),
        (g = n(g, v, S, f, m[d + 0], 20, 3921069994)),
        (f = n(f, g, v, S, m[d + 5], 5, 3593408605)),
        (S = n(S, f, g, v, m[d + 10], 9, 38016083)),
        (v = n(v, S, f, g, m[d + 15], 14, 3634488961)),
        (g = n(g, v, S, f, m[d + 4], 20, 3889429448)),
        (f = n(f, g, v, S, m[d + 9], 5, 568446438)),
        (S = n(S, f, g, v, m[d + 14], 9, 3275163606)),
        (v = n(v, S, f, g, m[d + 3], 14, 4107603335)),
        (g = n(g, v, S, f, m[d + 8], 20, 1163531501)),
        (f = n(f, g, v, S, m[d + 13], 5, 2850285829)),
        (S = n(S, f, g, v, m[d + 2], 9, 4243563512)),
        (v = n(v, S, f, g, m[d + 7], 14, 1735328473)),
        (g = n(g, v, S, f, m[d + 12], 20, 2368359562)),
        (f = a(f, g, v, S, m[d + 5], 4, 4294588738)),
        (S = a(S, f, g, v, m[d + 8], 11, 2272392833)),
        (v = a(v, S, f, g, m[d + 11], 16, 1839030562)),
        (g = a(g, v, S, f, m[d + 14], 23, 4259657740)),
        (f = a(f, g, v, S, m[d + 1], 4, 2763975236)),
        (S = a(S, f, g, v, m[d + 4], 11, 1272893353)),
        (v = a(v, S, f, g, m[d + 7], 16, 4139469664)),
        (g = a(g, v, S, f, m[d + 10], 23, 3200236656)),
        (f = a(f, g, v, S, m[d + 13], 4, 681279174)),
        (S = a(S, f, g, v, m[d + 0], 11, 3936430074)),
        (v = a(v, S, f, g, m[d + 3], 16, 3572445317)),
        (g = a(g, v, S, f, m[d + 6], 23, 76029189)),
        (f = a(f, g, v, S, m[d + 9], 4, 3654602809)),
        (S = a(S, f, g, v, m[d + 12], 11, 3873151461)),
        (v = a(v, S, f, g, m[d + 15], 16, 530742520)),
        (g = a(g, v, S, f, m[d + 2], 23, 3299628645)),
        (f = u(f, g, v, S, m[d + 0], 6, 4096336452)),
        (S = u(S, f, g, v, m[d + 7], 10, 1126891415)),
        (v = u(v, S, f, g, m[d + 14], 15, 2878612391)),
        (g = u(g, v, S, f, m[d + 5], 21, 4237533241)),
        (f = u(f, g, v, S, m[d + 12], 6, 1700485571)),
        (S = u(S, f, g, v, m[d + 3], 10, 2399980690)),
        (v = u(v, S, f, g, m[d + 10], 15, 4293915773)),
        (g = u(g, v, S, f, m[d + 1], 21, 2240044497)),
        (f = u(f, g, v, S, m[d + 8], 6, 1873313359)),
        (S = u(S, f, g, v, m[d + 15], 10, 4264355552)),
        (v = u(v, S, f, g, m[d + 6], 15, 2734768916)),
        (g = u(g, v, S, f, m[d + 13], 21, 1309151649)),
        (f = u(f, g, v, S, m[d + 4], 6, 4149444226)),
        (S = u(S, f, g, v, m[d + 11], 10, 3174756917)),
        (v = u(v, S, f, g, m[d + 2], 15, 718787259)),
        (g = u(g, v, S, f, m[d + 9], 21, 3951481745)),
        (f = o(f, h)),
        (g = o(g, c)),
        (v = o(v, p)),
        (S = o(S, s));
    return 32 == e
      ? (l(f) + l(g) + l(v) + l(S)).toLowerCase()
      : (l(g) + l(v)).toLowerCase();
  }
  const nonce = String(Math.random());
  const SAILT =
    "rytujfghjd#$%^$%^*#^2345thdghdfgWERTSFS356E6Ysssfgsyw5$&^*#%^^@%$TFgsfyew5yq465467456SFGDHERTYERTY#%$6yhdgh";
  const checksum = hex(nonce + `scriptId=${scriptId}` + SAILT);
  return fetch("https://api.h5.helloaba.cn/script/v2/platformScriptInfo", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      appheader: "{}",
      checksum,
      clienttype: "1",
      clientversion: "3.0.0",
      "content-type": "application/json",
      curtime: "1755009015435",
      mobiletype: "0",
      nonce,
      "sec-ch-ua":
        '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      usertoken: "",
      Referer: "https://m.helloaa.cn/",
    },
    body: JSON.stringify({
      scriptId,
    }),
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.head.code === 200 && res.data) {
        scripts.push(res.data);
        console.log(`[${res.data.scriptName}] 请求完成`);
        return res.data;
      }
    });
}

const promiseList = [];

// [...har.log.entries, ...har1.log.entries].forEach((item) => {
//   if (
//     item.request.url !==
//     "https://juzujujk.joylovemeet.cn/v9/script/scriptSearchPage"
//   ) {
//     return;
//   }
//   const res = JSON.parse(item.response.content.text);
//   if (res.head.code === 200 && res.data) {
//     res.data.items.forEach((script) => {
//       promiseList.push(limit(() => getScriptDetail(script.scriptId)));
//     });
//   }
// });

[
  "352334670013312512",
  "552408531723213312",
  "447072538938183680",
  "434685226191172608",
  "193219570648390656",
  "213542106057695744",
  "421434268535370240",
  "367164698165161472",
  "438531837556175872",
  "503342717959428608",
  "83753296793137872",
  "366426079754366464",
  "426655643097286144",
  "52586724875648201",
  "101451607184540672",
  "101449575665009664",
  "83753296793137835",
  "369409063390457344",
  "473278019901840896",
].forEach(id => {
  promiseList.push(limit(() => getScriptDetail(id)));
});

Promise.all(promiseList).then(() => {
  fs.writeFileSync(
    "./script-list.json",
    JSON.stringify(scripts, null, 2)
  );
});
