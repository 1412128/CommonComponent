import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dropdown,
  Form,
  TextArea,
  Icon,
  Input
} from 'semantic-ui-react';
import { SIDE_PANEL_STEP } from 'constants/SidePanelStep';
import { Categories } from 'components/menuCategory/DefineCategory';
import ImageUpload from 'components/imageUpload/ImageUpload';
import './Form.scss';
import { updatePropsApp } from 'actions/PropsAppAction';

class FormLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      _id: null,
      address: '',
      title: '',
      event: null,
      description: '',
      file: null
    };
    this.inputFileDevice = React.createRef();
    this.inputFileCamera = React.createRef();
    this.optionsEvent = Categories[0].subCategory.map(item => {
      return { key: item.index, text: item.content, value: item.index };
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRemoveFile = this.handleRemoveFile.bind(this);
    this.handleDragDropImage = this.handleDragDropImage.bind(this);
    this.handleInputFileOnSmartPhone = this.handleInputFileOnSmartPhone.bind(
      this
    );
    this.triggerInputFileDevice = this.triggerInputFileDevice.bind(this);
    this.triggerInputFileCamera = this.triggerInputFileCamera.bind(this);
    this.handleIconLocationClick = this.handleIconLocationClick.bind(this);
  }

  componentDidMount() {
    const { stepData } = this.props;
    if (_.get(stepData, 'dataForm')) {
      this.setState({
        ..._.get(stepData, 'dataForm')
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { onChangeStep, stepData } = this.props;
    const { _id, address, title, event, description, file } = this.state;
    const dataForm = {
      // eslint-disable-next-line no-undef
      _id,
      address,
      title,
      event,
      description,
      file
    };
    onChangeStep(SIDE_PANEL_STEP.PREVIEW, {
      dataForm,
      _id: _id || _.get(stepData, 'dataForm._id'),
      backToRoot: _.get(stepData, 'backToRoot') || SIDE_PANEL_STEP.LIST_CARD
    });
  }

  handleInputChange(e, data) {
    e.preventDefault();
    this.setState({
      [data.name]: data.value || ''
    });
  }

  triggerInputFileDevice(e) {
    e.preventDefault();
    const { current } = this.inputFileDevice;
    if (current) current.click();
  }

  triggerInputFileCamera(e) {
    e.preventDefault();
    const { current } = this.inputFileCamera;
    if (current) current.click();
  }

  handleInputFileOnSmartPhone(e) {
    e.preventDefault();
    this.setState({
      file: e.target.files[0] || null
    });
  }

  handleDragDropImage(file) {
    this.setState({
      file
    });
  }

  handleRemoveFile() {
    this.setState({
      file: null
    });
  }

  handleIconLocationClick() {
    const { dispatch } = this.props;
    const address = document.getElementById('txtAddress').value;
    dispatch(
      updatePropsApp({
        customAddress: address
      })
    );
  }

  render() {
    const { onChangeStep, stepData, customAddress } = this.props;
    const { title, description, event, file } = this.state;
    let { address } = this.state;
    if (_.isEmpty(address) && customAddress) {
      address = customAddress.text;
    }
    return (
      <Form className="form-location">
        <div className="input-form">
          <Form.Field>
            <div className="flick-lower">
              <Icon
                name="window minimize outline"
                onClick={() =>
                  onChangeStep(
                    _.get(stepData, 'backToRoot') || SIDE_PANEL_STEP.LIST_CARD
                  )}
              />
            </div>
          </Form.Field>
          <Form.Field className="form-header">
            Enter information and post
          </Form.Field>
          <Form.Field>
            <Input
              id="txtAddress"
              placeholder="Enter address or specify location on map"
              icon={(
                <Icon
                  name="map marker alternate"
                  link
                  onClick={this.handleIconLocationClick}
                />
              )}
              name="address"
              value={address}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <Dropdown
              name="event"
              placeholder="Please select a category"
              className="event-dropdown"
              fluid
              selection
              value={event}
              options={this.optionsEvent}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
              placeholder="Enter title, name, etc."
              name="title"
              value={title}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <TextArea
              rows={5}
              name="description"
              value={description}
              placeholder="TPlease enter a comment or hashtag"
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <ImageUpload
              file={file}
              onRemoveFile={this.handleRemoveFile}
              onDragDropImage={this.handleDragDropImage}
            />
          </Form.Field>
        </div>
        <div className="btn-form">
          <Form.Field>
            <div className="sp-import-image">
              <span>
                <input
                  className="file-device"
                  type="file"
                  ref={this.inputFileDevice}
                  accept="image/*"
                  onChange={this.handleInputFileOnSmartPhone}
                />
                <Icon name="camera" onClick={this.triggerInputFileDevice} />
              </span>

              <span>
                <input
                  className="file-camera"
                  type="file"
                  ref={this.inputFileCamera}
                  accept="image/*"
                  capture="camera"
                  onChange={this.handleInputFileOnSmartPhone}
                />
                <Icon name="image" onClick={this.triggerInputFileCamera} />
              </span>
            </div>
            <div className="preview-btn">
              <Button type="submit" onClick={this.handleSubmit}>
                Preview
              </Button>
            </div>
          </Form.Field>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  customAddress: _.get(state, 'PropsAppReducer.propsApp.customAddress')
});

export default connect(mapStateToProps)(FormLocation);
