import { readAsDataURL, createElement, getHashQuery } from './utils';
import { defaultDir, loginUrl } from './config';
import {
  uploadSmall, getUploadUrl, uploadLarge, getShareId, genShareUrl,
} from './api';
import i18n from './i18n';

function main() {
  const query = getHashQuery();
  const { error } = query;
  const token = query.access_token;
  const errorDescription = query.error_description;

  if (error && errorDescription) {
    const dom = {
      tag: 'div',
      children: [
        {
          tag: 'p',
          innerText: error,
        },
        {
          tag: 'p',
          innerText: errorDescription,
        },
      ],
    };
    const tree = createElement(dom);
    document.querySelector('#root').appendChild(tree);
  } else if (!token) {
    window.location.href = loginUrl;
  } else {
    const lang = i18n[navigator.language] || i18n.en;
    const {
      filename, dir, upload, getUrl, imageId, url,
    } = lang;
    const dom = {
      tag: 'div',
      attributes: {
        class: 'container',
        style: 'padding-top: 20px',
      },
      children: [
        {
          tag: 'div',
          attributes: {
            class: 'form-group',
          },
          children: [
            {
              tag: 'input',
              attributes: {
                type: 'file',
                id: 'file-selector',
                accept: 'image/*',
              },
              listeners: {
                onchange: async function onchange() {
                  document.querySelector('#img-id').value = '';
                  document.querySelector('#img-link').value = '';

                  const file = this.files[0];
                  const localImage = document.querySelector('#img-local');
                  const nameInput = document.querySelector('#filename');
                  if (file) {
                    const reader = await readAsDataURL(file);
                    localImage.setAttribute('src', reader.result);
                    localImage.style.display = 'block';
                    nameInput.value = file.name;
                  } else {
                    localImage.style.display = 'none';
                    nameInput.value = '';
                  }
                },
              },
            },
            {
              tag: 'img',
              attributes: {
                src: '',
                id: 'img-local',
                style: 'max-width:300px;max-height:300px;padding-top: 20px;display: none;',
              },
            },
          ],
        },
        {
          tag: 'div',
          attributes: {
            class: 'form-group',
          },
          children: [
            {
              tag: 'label',
              attributes: {
                for: 'filename',
              },
              innerText: filename,
            },
            {
              tag: 'input',
              attributes: {
                type: 'text',
                class: 'form-control',
                id: 'filename',
              },
            },
          ],
        },
        {
          tag: 'div',
          attributes: {
            class: 'form-group',
          },
          children: [
            {
              tag: 'label',
              attributes: {
                for: 'dir',
              },
              innerText: dir,
            },
            {
              tag: 'input',
              attributes: {
                type: 'text',
                class: 'form-control',
                id: 'dir',
              },
              value: defaultDir,
            },
          ],
        },
        {
          tag: 'div',
          attributes: {
            class: 'form-group',
          },
          children: [
            {
              tag: 'button',
              attributes: {
                type: 'button',
                class: 'btn btn-primary',
                id: 'upload',
              },
              listeners: {
                onclick: async function onclick() {
                  const file = document.querySelector('#file-selector').files[0];
                  const directory = document.querySelector('#dir').value;
                  const fullPath = `${directory}/${file.name}`;
                  const idInput = document.querySelector('#img-id');
                  let uploadResponse;
                  if (file.size > 4 * 1000 * 1000) {
                    const { data } = await getUploadUrl(fullPath, token);
                    uploadResponse = await uploadLarge(file, data.uploadUrl, file.size);
                  } else {
                    uploadResponse = await uploadSmall(file, fullPath, token);
                  }
                  idInput.value = uploadResponse.data.id;
                },
              },
              innerText: upload,
            },
            {
              tag: 'button',
              attributes: {
                type: 'button',
                class: 'btn btn-primary',
                id: 'get-link',
              },
              listeners: {
                onclick: async function onclick() {
                  const idInput = document.querySelector('#img-id');
                  const { data } = await getShareId(idInput.value, token);
                  document.querySelector('#img-link').value = genShareUrl(data.shareId);
                },
              },
              innerText: getUrl,
            },
          ],
        },
        {
          tag: 'div',
          attributes: {
            class: 'form-group',
          },
          children: [
            {
              tag: 'label',
              innerText: imageId,
            },
            {
              tag: 'input',
              attributes: {
                type: 'text',
                class: 'form-control',
                id: 'img-id',
                disabled: true,
              },
            },
          ],
        },
        {
          tag: 'div',
          attributes: {
            class: 'form-group',
          },
          children: [
            {
              tag: 'label',
              innerText: url,
            },
            {
              tag: 'input',
              attributes: {
                type: 'text',
                class: 'form-control',
                id: 'img-link',
                disabled: true,
              },
            },
          ],
        },
      ],
    };
    const tree = createElement(dom);
    document.querySelector('#root').appendChild(tree);
  }
}

main();
