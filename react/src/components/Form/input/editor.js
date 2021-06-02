import React, {useState} from 'react';
import MediaManagement from '../../MediaManagement';
import JoditEditor from '../../JoditEditor';

export default ({value, onChange}) => {
  const [isVisible, setIsVisible] = useState(false);

  const _onChange = (html) => {
    onChange && onChange(html);
  };

  const onSelect = (newUrl) => {
    window.editorInsert(newUrl);
    setIsVisible(false);
  };
  window.editorSetIsVisible = setIsVisible;


  return (
    <>
      <JoditEditor
        value={value}
        config={defaultConfig}
        tabIndex={1}
        onChange={_onChange}
      />
      <MediaManagement isVisible={isVisible} onSelect={onSelect} limit={1} onHide={() => setIsVisible(false)}/>
    </>
  );
};
const defaultConfig = {
  zIndex: 1,
  iframe: true,
  iframeCSSLinks: [
    "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.css",
  ],
  uploader: {
    insertImageAsBase64URI: true
  },
  buttons: "source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,video,table,link,|,superscript,subscript,strikethrough,font,fontsize,brush,eraser",
  buttonsMD: "source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,video,table,link,|,dots",
  buttonsSM: "source,fullsize,|,bold,italic,underline,paragraph,align,|,ul,ol,outdent,indent,hr,|,dots",
  buttonsXS: "bold,italic,underline,paragraph,align,|,dots",
  toolbarButtonSize: "small",
  extraButtons: [
    {
      icon: 'image',
      tooltip: 'Image',
      popup: (editor, current, self, close) => {
        const insert = (src = "https://xdsoft.net/jodit/build/images/artio.jpg") => {
          editor.s.insertNode(
            editor.createInside.fromHTML(
              `<img style="width: 100%" src="${src}" alt="WeSports"/>`
            )
          );
        };
        window.editorInsert = insert;
        window.editorSetIsVisible(true);
      }
    }
  ],
  events: {
    afterInit: function (editor) {
      // setTimeout(() => {
      //   const iframeJSLinks = [
      //     "https://code.jquery.com/jquery-2.1.3.min.js",
      //     "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.js",
      //   ];
      //   editor.iframe.contentDocument.getElementsByTagName("html")[0]
      //     .setAttribute("style", "overflow-y: auto")
      //   iframeJSLinks.forEach(href => {
      //     const script = editor.iframe.contentDocument.createElement("script");
      //
      //     script.setAttribute("src", href);
      //     script.setAttribute("type", "text/javascript");
      //
      //     editor.iframe.contentDocument.head && editor.iframe.contentDocument.head.appendChild(script);
      //   });
      // }, 5000)
    }
  }
};
