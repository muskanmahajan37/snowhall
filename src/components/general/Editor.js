import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native'
import { Icon, Button } from 'react-native-elements';
var ImagePicker = require('react-native-image-picker');

export default class EditorComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    }
  }

  render() {
    let that = this;
    return (
      <View>
        <TextInput
          placeholder={this.props.placeholder}
          multiline={true}
          style={styles.textInput}
          value={this.props.text}
          onChangeText={this.props.onChangeText}
        />
        <View style={styles.toolbar}>
          <View style={styles.tool}>
            <Button
              icon={{name: 'camera'}}
              onPress={this.pickUpImage.bind(that)}
            />
          </View>
          <View style={styles.tool}>
            <Icon name={'location-on'} size={26} color={'#CCC'}/>
          </View>
          {this.state.image ?
            <View>
              <Image source={require(this.state.image)}/>
            </View> : null
          }
        </View>
      </View>
    )
  }

  pickUpImage() {
    let that = this;
    let options = {
      title: '选择图片',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册选择',
      cancelButtonTitle: '取消',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        that.state.image = source;
      }
    });
  }
}

EditorComp.propTypes = {
  enableTools: PropTypes.string,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func
};

EditorComp.defaultProps = {
  enableTools: 'camera, album, emotion, at, location'
};

const styles = StyleSheet.create({
  textInput: {
    height: 160,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    textAlignVertical: 'top'
  },
  toolbar: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#dadada',
  },
  tool: {
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5
  },
  toolText: {
    fontSize: 22,
    fontFamily: 'iconfont',
    color: '#666'
  }
});
