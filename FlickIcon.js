import React, { Component } from 'react';
import { SIDE_PANEL_STEP } from 'constants/SidePanelStep';
import './FlickIcon.scss';

class FlickIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      originalX: 0,
      originalY: 0,
      lastTranslateX: 0,
      lastTranslateY: 0
    };
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    this.event = null;
    this.flickIconRef = React.createRef();
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    this.event = this.isMobile
      ? {
          start: 'touchstart',
          move: 'touchmove',
          end: 'touchend'
        }
      : {
          start: 'mousedown',
          move: 'mousemove',
          end: 'mouseup'
        };
    const flickIconDiv = this.flickIconRef.current;
    flickIconDiv.addEventListener(this.event.start, this.handleMouseDown);
    window.addEventListener(this.event.end, this.handleMouseUp);
  }

  componentWillUnmount() {
    const flickIconDiv = this.flickIconRef.current;
    flickIconDiv.removeEventListener(this.event.move, this.handleMouseDown);
    window.removeEventListener(this.event.end, this.handleMouseUp);
  }

  handleMouseDown(event) {
    event.stopPropagation();
    window.addEventListener(this.event.move, this.handleMouseMove);
    const clientX = this.isMobile
      ? event.targetTouches[0].clientX
      : event.clientX;
    const clientY = this.isMobile
      ? event.targetTouches[0].clientY
      : event.clientY;
    this.setState({
      originalX: clientX,
      originalY: clientY,
      lastTranslateX: 0,
      lastTranslateY: 0,
      isDragging: true
    });
  }

  handleMouseMove(event) {
    event.stopPropagation();
    const { isDragging } = this.state;
    if (isDragging) {
      const {
        originalX,
        lastTranslateX,
        originalY,
        lastTranslateY
      } = this.state;
      const { onClickFlickIcon } = this.props;
      const clientX = this.isMobile
        ? event.targetTouches[0].clientX
        : event.clientX;
      const clientY = this.isMobile
        ? event.targetTouches[0].clientY
        : event.clientY;
      if (onClickFlickIcon) {
        onClickFlickIcon({
          translateX: clientX - originalX + lastTranslateX,
          translateY: clientY - originalY + lastTranslateY
        });
      }
    }
  }

  handleMouseUp() {
    window.removeEventListener(this.event.move, this.handleMouseMove);
    const { isDragging } = this.state;
    if (isDragging) {
      this.setState({
        originalX: 0,
        originalY: 0,
        lastTranslateX: 0,
        lastTranslateY: 0,
        isDragging: false
      });
    }
  }

  render() {
    const { stepData, onChangeStep } = this.props;
    return (
      <div
        role="button"
        tabIndex={0}
        className="flick-lower"
        ref={this.flickIconRef}
        onClick={() => {
          if (onChangeStep && stepData) {
            onChangeStep(
              _.get(stepData, 'backToRoot') || SIDE_PANEL_STEP.LIST_CARD
            );
          }
        }}
      >
        <hr />
      </div>
    );
  }
}
export default FlickIcon;
