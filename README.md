# TagInput

#### TagInput is a customizable React component that provides an input field for entering both simple text and tags in content-editable text input.

#### With TagInput, you can easily create tag input fields for your web applications without having to worry about complex implementation details.

<br>

### Installation

To use TagInput in your React project, simply install it via NPM:

```shell
npm install @pradeepmishra/taginput
```

Then, import it into your project:

```jsx
import TagInput from '@pradeepmishra/taginput';
```

### Peer Dependencies

TagInput has peer dependencies of the following npm libraries

1. react
2. slate
3. slate-react

make sure you have them all in your project's dependencies.

### Usage

TagInput can be used like any other React component, with props for customization:

```jsx
<TagInput
  removeTagButton={false}
  initValue='Initial {{tag}} value'
  onValueChange={(value) => console.log(`New value: ${value}`)}
  addImageElement={(tagContent) => (
    <img src={`https://example.com/${tagContent}`} />
  )}
  transformInputText={(tagContent) => tagContent.toUpperCase()}
  transformInputElement={(tagContent) => (
    <span style={{ color: 'blue' }}>{tagContent}</span>
  )}
/>
```

### Props

`removeTagButton`: Boolean (optional) - hide the delete button in all tags (default: false).
`initValue`: String (optional) - provides an initial value for the input field (default: "").
`onValueChange`: Function (optional) - called when the value of the input field changes. The new value is passed as an argument to the function.
`addImageElement`: Function (optional) - called when a new tag is added. The content of the tag is passed as an argument to the function, and the function should return a valid HTML element to be displayed in the tag.
`transformInputText`: Function (optional) - called when a new tag is added. The content of the tag is passed as an argument to the function, and the function should return a transformed string to be displayed in the tag.
`transformInputElement`: Function (optional) - called when a new tag is added. The content of the tag is passed as an argument to the function, and the function should return a transformed HTML element to be displayed in the tag.

### License

TagInput is released under the MIT License.
Feel free to use it in your personal or commercial projects. If you have any questions or issues, please feel free to open an issue on the [Github](https://github.com/pradeep-mishra/taginput) repository.

### Author

Pradeep Mishra
[Github](https://github.com/pradeep-mishra)
[Twitter](https://twitter.com/ipradeepmishra)
[Linkedin](https://www.linkedin.com/in/ipradeepmishra/)

#### Demo site

[https://ce-taginput.netlify.app/](https://ce-taginput.netlify.app)

### Rendered view

![Rendered](/assets/ss.png)
