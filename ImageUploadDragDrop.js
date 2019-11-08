import React, { Component } from "react";
import { Icon, Button } from "semantic-ui-react";
import "./ImageUpload.scss";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drag: false
    };
    this.dropRef = React.createRef();
    this.inputFileElm = React.createRef();
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOut = this.handleDragOut.bind(this);
    this.triggerInputFile = this.triggerInputFile.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    const div = this.dropRef.current;
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }

  componentWillUnmount() {
    const div = this.dropRef.current;
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }

  handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    const { drag } = this.state;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0 && !drag) {
      this.setState({ drag: true });
    }
  }

  handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const { onDragDropImage } = this.props;
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDragDropImage(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }

  triggerInputFile(e) {
    e.preventDefault();
    const { current } = this.inputFileElm;
    if (current) current.click();
  }

  handleInputChange(e) {
    const { onDragDropImage } = this.props;
    e.preventDefault();
    onDragDropImage(e.target.files[0]);
  }

  render() {
    const { file, onRemoveFile } = this.props;
    const { drag } = this.state;
    const isDrag = drag ? " drag" : "";
    return (
      <div className="image-upload" ref={this.dropRef}>
        <input
          name="file"
          type="file"
          placeholder="Drag and drop images"
          className="file-input"
          ref={this.inputFileElm}
          onChange={this.handleInputChange}
        />
        {file ? (
          <div className="drag-drop">
            <div className={`hasFile${isDrag}`}>
              <span>{file.name}</span>
              <span>
                <Icon name="close" onClick={onRemoveFile} className="remove" />
              </span>
            </div>
          </div>
        ) : (
          <div className="drag-drop">
            <Button
              className={`content${isDrag}`}
              onClick={this.triggerInputFile}
              basic
            >
              <span>
                <Icon name="image" />
              </span>
              <span>Drag and drop images</span>
            </Button>
          </div>
        )}
      </div>
    );
  }
}
export default ImageUpload;
