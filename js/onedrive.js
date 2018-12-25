window.onload = () => {
// todo: your client id
  onedrive_client_id = ''
// scopes
  onedrive_scope = 'openid https://graph.microsoft.com/Files.ReadWrite.All'
// todo: redirect URL after logging in
  onedrive_redirect_url = ''
// login url
  onedrive_login_url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedrive_client_id}&response_type=token&redirect_uri=${onedrive_redirect_url}&scope=${onedrive_scope}`
// token
  onedrive_token = ''
// timeout
  ajax_timeout = 30000
// file size - 4Mb 60Mb
  mb_4 = 4 * 1000 * 1000
  mb_60 = 60 * 1000 * 1000
// default upload dir in onedrive
  default_dir = 'test'

  tokenFlow()

  document.getElementById('file-select').addEventListener('click', () => {
    document.getElementById("file").click()
  })

  document.getElementById("file").addEventListener("change", async () => {
    let inputs = document.querySelectorAll('input[type="text"]')
    for (let index = 0; index < inputs.length; index++) {
      inputs[index].value = ''
    }
    let file = document.getElementById("file").files[0]
    if (file) {
      let reader = await dataUrlPromise(file)
      document.getElementById('local-img').style.display = 'block'
      document.getElementById('local-img').setAttribute('src', reader.result)
    }
    else {
      document.getElementById('local-img').style.display = 'none'
      document.getElementById('local-img').setAttribute('src', '')
    }
  })

  document.getElementById("img-upload").addEventListener("click", async () => {
    let if_preview = document.getElementById('if-preview').checked
    let img_origin = document.getElementById("file").files[0]

    if (!fileCheck(img_origin)) return

    // upload dir and file name
    let [dir_name, file_name] = defaultNames()
    let file_type = img_origin.type.split('/')[1]
    let [origin_name, preview_name] = file_names(file_name, file_type)

    try {
      // original image
      // upload & share
      let origin_share_url = await uploadAndShare(img_origin, dir_name, origin_name)
      document.getElementById("origin-img").style.display = 'block'
      document.getElementById("origin-img").setAttribute("src", origin_share_url)
      document.getElementById("img-url").value = origin_share_url

      // generate preview image
      if (if_preview) {

        let blob = img_origin.type.indexOf('gif') !== -1
          ? await gifSplit(img_origin)
          : img_origin

        // compress
        let img_compressed = await imgCompress(blob)

        // upload & share
        let preview_share_url = await uploadAndShare(img_compressed, dir_name, preview_name)
        document.getElementById("pre-img").style.display = 'block'
        document.getElementById("pre-img").setAttribute("src", preview_share_url)
        document.getElementById("pre-url").value = preview_share_url
      }
      document.getElementById("file").value = ''
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert('login state expired')
          window.location.href = onedrive_login_url
        }
      }
      else {
        console.error(error)
      }
    }
  })
}

/**
 * ==== .. ====
 */

/**
 * extract gif and get the first frame as preview image
 */
async function gifSplit(img) {
  // todo: is there anyway to optimize?
  // 1. extract
  // file => fileReader
  let file_reader = await arrayBufferPromise(img)
  // console.log(file_reader)
  // fileReader => arrayBuffer
  let img_array_buffer = file_reader.result
  // console.log(img_array_buffer)
  // arrayBuffer => blob
  let img_origin_blob = new Blob([img_array_buffer])
  // console.log(img_origin_blob)
  // blob => blob url
  let img_origin_blob_url = URL.createObjectURL(img_origin_blob)
  // console.log(img_origin_blob_url)
  // blob url => frames
  let frames = await gifFrames({url: img_origin_blob_url, frames: 0, outputType: 'canvas'})
  // console.log(frames)
  // frames => canvas
  let frame1_canvas = frames[0].getImage()
  // console.log(frame1_canvas)

  // 2. compress
  // canvas => blob
  return canvasToBlob(frame1_canvas)
}

/**
 * upload & share according to its size
 */
async function uploadAndShare(blob, dir_name, file_name) {
  if (blob.size >= mb_4) {
    // 60Mb
    // get upload url
    let upload_url_response = await uploadPic60Step1(dir_name, file_name)
    // upload
    let upload_response = await uploadPic60Step2(blob, upload_url_response, blob.size)
    // share
    let share_response = await getShareId(upload_response.data.id)
    return img_share_url(share_response.data.shareId)
  }
  else {
    // 4Mb
    // upload
    let upload_response = await uploadPic4(blob, dir_name, file_name)
    // share
    let share_response = await getShareId(upload_response.data.id)
    return img_share_url(share_response.data.shareId)
  }
}

/**
 * ==== OneDrive API functions ====
 */

/**
 * OneDrive API: upload image smaller than 4Mb
 */
function uploadPic4(blob, dir_name, file_full_name) {
  return axios({
    method: 'PUT',
    url: upload_url_4mb(dir_name, file_full_name),
    data: blob,
    headers: {
      'Authorization': 'Bearer ' + onedrive_token
    },
    timeout: ajax_timeout,
    onUploadProgress: function (progressEvent) {
      let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%'
      console.log(percentCompleted)
    }
  })
}

/**
 * OneDrive API: get upload url of image 4Mb < size < 60Mb
 */
function uploadPic60Step1(dir_name, file_full_name) {
  return axios({
    method: 'POST',
    url: upload_url_60mb(dir_name, file_full_name),
    headers: {
      'Authorization': 'Bearer ' + onedrive_token,
      'Content-Type': 'application/json',
    },
    timeout: ajax_timeout,
  })
}

/**
 * OneDrive API: upload image 4Mb < size < 60Mb
 */
function uploadPic60Step2(blob, upload_url, size) {
  return axios({
    method: 'PUT',
    url: upload_url,
    data: blob,
    headers: {
      'Content-Range': 'bytes 0-' + (size - 1) + '/' + size
    },
    timeout: ajax_timeout,
    onUploadProgress: function (progressEvent) {
      let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log(percentCompleted)
    }
  })
}

/**
 * OneDrive API: share
 */
function getShareId(id) {
  return axios({
    method: 'POST',
    url: share_upload_url(id),
    data: {
      type: 'view',
      scope: 'anonymous'
    },
    headers: {
      'Authorization': 'Bearer ' + onedrive_token,
      'Content-Type': 'application/json'
    },
    timeout: ajax_timeout,
  })
}

/**
 * ==== template strings ====
 */

/**
 * upload url of image smaller than 4Mb
 */
function upload_url_4mb(dir_name, file_full_name) {
  return `https://graph.microsoft.com/v1.0/me/drive/root:/${dir_name}/${file_full_name}:/content`
}

/**
 * upload url of image 4Mb < size < 60Mb
 */
function upload_url_60mb(dir_name, file_full_name) {
  return `https://graph.microsoft.com/v1.0/drive/root:/${dir_name}/${file_full_name}:/createUploadSession`
}

/**
 * share url
 */
function share_upload_url(id) {
  return `https://graph.microsoft.com/v1.0/me/drive/items/${id}/createLink`
}

/**
 * image link
 */
function img_share_url(share_id) {
  return `https://api.onedrive.com/v1.0/shares/${share_id}/root/content`
}

/**
 * ==== utils ====
 */

/**
 * image compress
 */
function imgCompress(data, max_width = 200, max_height = 200, quality = 0.6) {
  // data could be file or blob
  const imageCompressor = new ImageCompressor()
  return imageCompressor.compress(
    data,
    {
      maxWidth: max_width,
      maxHeight: max_height,
      quality: quality
    }
  )
}

/**
 * token
 */
function tokenFlow() {
  let url_sharp = window.location.href.split('#')
  // no token
  if (url_sharp.length === 1) {
    window.location = onedrive_login_url
    return
  }
  // no token
  let token_reg = url_sharp[1].match(/(access_token=)([a-zA-Z0-9/%]*)/)
  if (!token_reg) {
    window.location = onedrive_login_url
    return
  }
  // has token
  onedrive_token = token_reg[2]
}

/**
 * default upload dir and file name
 */
function defaultNames() {
  let dir_input = document.getElementById("filepath").value
  let file_name_input = document.getElementById("filename").value
  let dir = dir_input ? dir_input : default_dir
  let file_name = file_name_input ? file_name_input : new Date().getTime()
  return [dir, file_name]
}

/**
 * check file type
 */
function fileCheck(file) {
  if (!file) {
    alert('no file selected')
    return false
  }
  if (!file.type.match(/image.*/)) {
    alert('incorrect file type')
    return false
  }
  // 60Mb以上
  if (file.size > mb_60) {
    alert('60Mb at most')
    return false
  }
  return true
}

/**
 * file names
 */
function file_names(file_name, file_type) {
  let timestamp = new Date().getTime()
  return [`${file_name}-${timestamp}.${file_type}`, `${file_name}-preiview-${timestamp}.${file_type}`]
}

/**
 * ==== promisfy ====
 */

/**
 * promisfy arrayBuffer
 */
function arrayBufferPromise(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader()
    fr.readAsArrayBuffer(file)
    fr.onloadend = () => {
      resolve(fr)
    }
  })
}

/**
 * promisfy dataURL
 */
function dataUrlPromise(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onloadend = () => {
      resolve(fr)
    }
  })
}

/**
 * promisfy Canvas.toBlob
 */
function canvasToBlob(canvas) {
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      resolve(blob)
    })
  })
}
