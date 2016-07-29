'use strict';

var React = require('react');
var ReactNative = require('react-native');
var tweenState = require('react-tween-state');

var {
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} = ReactNative;

var TimerMixin = require('react-timer-mixin');

var styles = require('./styles');
var images = require('./images');

var SPIN_DURATION = 1000;

var ProgressHUDMixin = {
  getInitialState() {
    return {
      is_hud_visible: false
    };
  },

  showProgressHUD() {
    this.setState({
      is_hud_visible: true,
		hud_status: undefined,
    });
  },

  showSuccessWithStatus(status, callback) {
	this.setState({
		show_status_callback:callback,
      is_hud_visible: true,
		//hud_status: '√ ' + status,
		hud_status: status,
		hud_status_image: 'hud_success',
	});
  },
		
  showErrorWithStatus(status, callback) {
	this.setState({
		show_status_callback:callback,
      is_hud_visible: true,
		//hud_status: 'X' + status,
		hud_status: status,
		hud_status_image: 'hud_error',
	});
  },

  dismissProgressHUD() {
    this.setState({
      is_hud_visible: false,
		hud_status: undefined,
    });
  },

  childContextTypes: {
    showProgressHUD: React.PropTypes.func,
    dismissProgressHUD: React.PropTypes.func,
    showSuccessWithStatus: React.PropTypes.func,
    showErrorWithStatus: React.PropTypes.func,
	state: React.PropTypes.object,
  },

  getChildContext() {
    return {
      showProgressHUD: this.showProgressHUD,
      dismissProgressHUD: this.dismissProgressHUD,
      showSuccessWithStatus: this.showSuccessWithStatus,
      showErrorWithStatus: this.showErrorWithStatus,
	  state: this.state,
    };
  },
};

var ProgressHUD = React.createClass({
  mixins: [tweenState.Mixin, TimerMixin],

  contextTypes: {
    showProgressHUD: React.PropTypes.func.isRequired,
    dismissProgressHUD: React.PropTypes.func,
    showSuccessWithStatus: React.PropTypes.func,
    showErrorWithStatus: React.PropTypes.func,
	state: React.PropTypes.object,
  },

  statics: {
    Mixin: ProgressHUDMixin
  },

  propTypes: {
    isDismissible: React.PropTypes.bool,
    isVisible: React.PropTypes.bool.isRequired,
	status: React.PropTypes.string,
    color: React.PropTypes.string,
    overlayColor: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      isDismissible: false,
      color: '#000',
      overlayColor: 'rgba(0, 0, 0, 0)'
    };
  },

  getInitialState() {
    return {
      rotate_deg: 0
    };
  },

  componentDidMount() {
	if(!this.props.status){
		// Kick off rotation animation
		this._rotateSpinner();

		// Set rotation interval
		this.interval = setInterval(() => {
		  this._rotateSpinner();
		}, SPIN_DURATION);
	}
  },

  /*
  componentWillUpdate(nextProps, nextState) {
	  if(nextProps.status && this.timeout){
		  this.clearTimeout(this.timeout);
		  this.timeout = undefined;
	  }
  },
  */
  componentDidUpdate(prevProps, prevState) {
	  //如果是显示的success or failure状态，隔一段时间后自动消失
	if(this.props.status && this.timeout === undefined){
		var duration = Math.min(this.props.status.length * 60 + 500, 5000);
		this.timeout = this.setTimeout(() => {
			if (this.props.isDismissible) {
			  this.context.dismissProgressHUD();
			}
			if(this.props.callback){
				this.props.callback();
			}
			this.timeout = undefined;
		}, duration);
	}
  },

  componentWillUnmount() {
	if(!this.props.status){
		clearInterval(this.interval);
	}
  },

  _rotateSpinner() {
    this.tweenState('rotate_deg', {
      easing: tweenState.easingTypes.linear,
      duration: SPIN_DURATION,
      endValue: this.state.rotate_deg === 0 ? 360 : this.state.rotate_deg + 360
    });
  },

  _clickHandler() {
    if (this.props.isDismissible) {
      this.context.dismissProgressHUD();
    }
  },

  render() {
    // Return early if not visible
    if (!this.props.isVisible) {
      return <View />;
    }

    // Set rotation property value
    var deg = Math.floor(
      this.getTweeningValue('rotate_deg')
    ).toString() + 'deg';

	var content = null;
	if(this.props.status){
		content = <View style={[styles.spinner, {width:250, backgroundColor:'white'}]}>
					<Image source={{uri:this.context.state.hud_status_image}} style={styles.hud_stauts_image} />
					<Text numberOfLines={5} style={styles.status}>{this.props.status}</Text>
				</View>;
	}
	else{
		content = <Image
            style={[styles.spinner, {
              backgroundColor: this.props.color,
			  height:50,
              transform: [
                {rotate: deg}
              ]
            }]}
            source={{
              uri: 'data:image/png;base64,' + images['1x'],
              isStatic: true
            }}
          >
            <View style={styles.inner_spinner}>
            </View>
          </Image>;
	}

    return (
      /*jshint ignore:start */
      <TouchableHighlight
        key="ProgressHUD"
        style={[styles.overlay, {
          backgroundColor: this.props.overlayColor
        }]}
        onPress={this._clickHandler}
        underlayColor={this.props.overlayColor}
        activeOpacity={1}
      >
        <View
          style={[styles.container, {
            left: this.getTweeningValue('left'),
		   width:this.props.status ? 250 : 100,
          }]}
        >
		{content}
        </View>
      </TouchableHighlight>
      /*jshint ignore:end */
    );
  }
});


module.exports = ProgressHUD;
