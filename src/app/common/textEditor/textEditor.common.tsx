import {ComponentPropsWithoutRef} from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
// @ts-ignore
// import BlotFormatter from 'quill-blot-formatter'
// @ts-ignore
// import ImageUploader from 'quill-image-uploader'

import 'react-quill/dist/quill.snow.css'
import './styles.css'
// import {api} from 'src/api'

// const ImageBase = Quill.import('formats/image')

// const ATTRIBUTES = ['alt', 'height', 'width', 'style']

// export default class CustomImage extends ImageBase {
//   static formats(domNode: any) {
//     return ATTRIBUTES.reduce((formats: any, attribute) => {
//       const copy = {...formats}

//       if (domNode.hasAttribute(attribute)) {
//         copy[attribute] = domNode.getAttribute(attribute)
//       }

//       return copy
//     }, {})
//   }

// format(name: any, value: any) {
//   if (ATTRIBUTES.indexOf(name) > -1) {
//     if (value) {
//       this.domNode.setAttribute(name, value)
//     } else {
//       this.domNode.removeAttribute(name)
//     }
//   } else {
//     super.format(name, value)
//   }
// }
// }

// Quill.register('modules/blotFormatter', BlotFormatter)
// Quill.register('formats/image', CustomImage)

// Quill.register('modules/imageUploader', ImageUploader)
interface TextEditorProps extends ComponentPropsWithoutRef<'div'> {
  descriptionBody: any
  onChange: any
  placeholder?: any
}

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
})

const TextEditorContainer = styled.div``

export const TextEditor = ({
  descriptionBody,
  onChange,
  placeholder,
  ...restProps
}: TextEditorProps) => {
  const onTextChange = (e: any) => {
    onChange(e)
  }

  return (
    <TextEditorContainer {...restProps}>
      <ReactQuill
        modules={EditorModules}
        formats={EditorFormats}
        onChange={onTextChange}
        theme="snow"
        value={descriptionBody}
        placeholder={placeholder}
      />
    </TextEditorContainer>
  )
}

const EditorModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{align: []}],

    [{list: 'ordered'}, {list: 'bullet'}],
    [{indent: '-1'}, {indent: '+1'}],

    [{size: []}],
    [{header: [1, 2, 3, 4, 5, '']}],
    ['link', 'image', 'video'],
    [{color: []}, {background: []}],
    ['blockquote', 'code-block'],

    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
  // imageUploader: {
  //   upload: (file: any) => {
  //     return new Promise((resolve, reject) => {
  //       const imgUrl = async () => {
  //         const image = new FormData()
  //         image.append('image', file)
  //         const response = await api<Api.Base<{url: string}>>('post')(
  //           'common-description/text-editor/upload',
  //           undefined,
  //           image
  //         )
  //         return response.data.data.data.url
  //       }
  //       const imageUrl = imgUrl()
  //       resolve(imageUrl)
  //     })
  //   }
  // },
  // blotFormatter: {
  //   // parchment: Quill.import('parchment'),
  //   modules: ['Resize', 'DisplaySize', 'Toolbar']
  // }
}

const EditorFormats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'align',
  'list',
  'indent',
  'size',
  'header',
  'link',
  'image',
  'video',
  'color',
  'background',
  'blockquote',
  'code-block',
  'clean',
  'height',
  'width',
  'class',
  'style'
]
