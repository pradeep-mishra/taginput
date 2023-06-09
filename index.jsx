import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Node, Transforms } from 'slate';
import {
  Editable,
  ReactEditor,
  Slate,
  useSlate,
  withReact
} from 'slate-react';
import './index.css';

const TAG_TESTER = /{{(.*?)}}/;

const findTag = (content, capturePattern) => {
  const match = capturePattern.exec(content);
  if (!match) {
    return null;
  }
  const last2Char = content.slice(-2);
  const isTagLastItem = last2Char === '}}';
  return {
    tagContent: match[1].trimStart(),
    tagLength: match[0].length,
    tagStartIndex: match.index,
    isTagLastItem
  };
};

const insertTagField = (editor, value, options) => {
  const tagField = [
    {
      type: 'tag',
      value,
      children: [{ text: value }]
    },
    { text: '' }
  ];
  Transforms.insertNodes(editor, tagField, options);
};

const addToPath = (path, incrBy) => {
  return [...path.slice(0, -1), path[path.length - 1] + incrBy];
};

const DefaultElement = ({ attributes, element, children }) => {
  return <p {...attributes}>{children}</p>;
};

const TagElement = ({
  attributes,
  element,
  children,
  removeTagButton,
  addImageElement,
  transformInputText,
  transformInputElement
}) => {
  const editor = useSlate();
  const handleDelete = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element)
    });
  };
  return (
    <span {...attributes} className='tag-wrapper'>
      <span
        className={`tag-text ${
          removeTagButton ? 'tag-text-right-padding' : ''
        }`}
      >
        {children}
        {addImageElement?.(element?.value)}
        {transformInputText ? (
          <span>{transformInputText(element?.value)}</span>
        ) : transformInputElement ? (
          transformInputElement(element?.value)
        ) : (
          <span>{element?.value}</span>
        )}
      </span>
      {!removeTagButton && (
        <span className='tag-del' onClick={handleDelete}>
          ×
        </span>
      )}
    </span>
  );
};

const TopPElement = ({ attributes, element, children }) => (
  <p {...attributes}>{children}</p>
);

const withTag = (editor, capturePattern) => {
  const { isInline, isVoid, normalizeNode, deleteBackward } = editor;

  editor.isInline = (element) => {
    return element.type === 'tag' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'tag' ? true : isVoid(element);
  };

  editor.normalizeNode = ([node, path]) => {
    if (!node?.text) {
      normalizeNode([node, path]);
      return;
    }
    const contents = Node.string(node);
    const tag = findTag(contents, capturePattern);
    if (tag) {
      const { tagContent, tagLength, tagStartIndex, isTagLastItem } =
        tag;
      const at = { path, offset: tagStartIndex };
      Transforms.delete(editor, {
        at,
        distance: tagLength,
        unit: 'character'
      });
      insertTagField(editor, tagContent, { at });
      if (isTagLastItem) {
        Transforms.select(editor, {
          path: addToPath(path, 2),
          offset: 0
        });
      }
    }
    normalizeNode([node, path]);
  };

  return editor;
};

const getContentArray = (content) => {
  const contentArray = content.map((node) => {
    if (node.type === 'paragraph') {
      return node.children.map((child) => {
        if (child.type === 'tag') {
          return `{{${child.value}}}`;
        }
        return child.text;
      });
    }
    return [];
  });
  return Array.isArray(contentArray[0])
    ? contentArray[0]
    : contentArray;
};

const getPlainText = (content) => {
  return getContentArray(content).join('');
};

const strToElm = (value, capturePattern) => {
  if (!value) {
    return [{ text: '' }];
  }
  return value
    .split(capturePattern)
    .map((val, i) =>
      i % 2
        ? { type: 'tag', value: val, children: [{ text: val }] }
        : { text: val }
    );
};

const parseInitValue = (value, capturePattern) => {
  return [
    {
      type: 'paragraph',
      className: 'textbox',
      children: strToElm(String(value), capturePattern)
    }
  ];
};

const TagInput = ({
  onValueChange = () => {},
  removeTagButton = false,
  initValue,
  addImageElement,
  transformInputText,
  transformInputElement,
  capturePattern = TAG_TESTER
}) => {
  if (!capturePattern instanceof RegExp) {
    throw new Error('capturePattern must be a RegExp');
  }
  const editor = useMemo(
    () => withTag(withReact(createEditor()), capturePattern),
    []
  );
  const [value, setValue] = useState(
    parseInitValue(initValue),
    capturePattern
  );
  let lastValue = initValue;

  const renderElement = useCallback(
    ({ element, children, attributes }) => {
      switch (element.type) {
        case 'paragraph':
          return (
            <TopPElement attributes={attributes} element={element}>
              {children}
            </TopPElement>
          );
        case 'tag':
          return (
            <TagElement
              attributes={attributes}
              element={element}
              removeTagButton={removeTagButton}
              addImageElement={addImageElement}
              transformInputText={transformInputText}
              transformInputElement={transformInputElement}
            >
              {children}
            </TagElement>
          );
        default:
          return (
            <DefaultElement attributes={attributes} element={element}>
              {children}
            </DefaultElement>
          );
      }
    },
    []
  );

  const onChange = useCallback((newValue) => {
    const plainText = getPlainText(newValue);
    if (plainText !== lastValue) {
      lastValue = newValue;
      setValue(newValue);
      onValueChange(plainText);
    }
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable
        className='ce-taginput'
        renderElement={renderElement}
      />
    </Slate>
  );
};

export { getPlainText, getContentArray, TagInput };
