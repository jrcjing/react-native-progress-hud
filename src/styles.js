'use strict';

var React = require('react-native');

var { StyleSheet } = React;

var styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#FFFFFF'
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderRadius: 50 / 2
  },
  inner_spinner: {
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    backgroundColor: '#FFFFFF'
  },
  status: {
	fontSize: 14,
	color: '#333333',
	marginBottom:10,
  },
  hud_stauts_image: {
	marginTop:10,
	width:28,
	height:28,
	marginBottom:10,
  },	
});

module.exports = styles;
