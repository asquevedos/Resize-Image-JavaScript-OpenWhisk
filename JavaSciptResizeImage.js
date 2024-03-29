/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const gm = require('gm').subClass({imageMagick: true});
const fs = require('fs')

function resize(fileSrc, fileDst, w, h) {
  return new Promise(function(resolve, reject) {
    gm(fileSrc).resize(w, h).write(fileDst, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * Resizes an image using imagemagick.
 *
 * @param img the image as base64 encoded string
 * @param w the width for the resized image
 * @param h the height for the resized image
 * @return { body: <base64 encoded image resized accordingly in JPEG format.> }
 */
function main({img, w, h}) {
  let data    = new Buffer(img, 'base64')
  let fileSrc = '/tmp/image-src.dat'
  let fileDst = '/tmp/image-dst.dat'

  fs.writeFileSync(fileSrc, data)

  return resize(fileSrc, fileDst, w, h)
  .then(_ => {
    let data = fs.readFileSync(fileDst)
    return {
      headers: { 'content-type': 'image/jpeg' },
      body: data.toString('base64')
    }
  })
  .catch(error => {
    console.error(error)
    return error
  })
}

if (process.env.TEST) {
  let i = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAA/klEQVQYGWNgAAEHBxaG//+ZQMyyn581Pfas+cRQnf1LfF" +
          "Ljf+62smUgcUbt0FA2Zh7drf/ffMy9vLn3RurrW9e5hCU11i2azfD4zu1/DHz8TAy/foUxsXBrFzHzC7r8+M9S1vn1qxQT07" +
          "dDjL9fdemrqKxlYGT6z8AIMo6hgeUfA0PUvy9fGFh5GWK3z7vNxSWt++jX99+8SoyiGQwsW38w8PJEM7x5v5SJ8f+/xv8MDA" +
          "zffv9hevfkWjiXBGMpMx+j2awovjcMjFztDO8+7GF49LkbZDCDeXLTWnZO7qDfn1/+5jbw/8pjYWS4wZLztXnuEuYTk2M+Mz" +
          "Iw/AcA36VewaD6fzsAAAAASUVORK5CYII="
  main({img: i, w: 128, h: 128}).then(console.log)
}
exports.main = main;
