import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import FSize from '../assets/commonCSS/FSize';

const CInput = ({
  title,
  name,
  isPassword,
  newlabel,
  style,
  value,
  setValue,
  keyboardType,
  multiline,
  numberOfLines
}: {
  title: string;
  name: string;
  isPassword: boolean;
  newlabel:boolean
  style: any;
  value: string;
  setValue: any;
  keyboardType: string;
  multiline?: boolean;
  numberOfLines?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(isPassword);

  return (
    <View style={[styles.inputSection, style]}>
      {
        title && <Text style={[styles.label, newlabel && styles.newlabel]}>{title}</Text>
      }
      <View
        style={[
          styles.textInputSection,
          isFocused && styles.inputSectionFocused,
        ]}>
        <TextInput
          style={[
            { textAlignVertical: multiline ? 'top' : 'center', fontSize:FSize.fs13, paddingLeft: wp(1), color: Colors.black},
          ]}
          placeholder={!isFocused ? `${name}` : ''}
          placeholderTextColor="#BCBCBC"
          value={value}
          onChangeText={setValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPasswordVisible}
          keyboardType={keyboardType === 'default' ? 'default' : keyboardType}
          multiline={multiline} 
          numberOfLines={numberOfLines} 
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{height: hp(3), width: hp(3)}}>
            <Image
              source={isPasswordVisible ? Images.eye : Images.eyec}
              resizeMode="contain"
              style={styles.imageStyle}></Image>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CInput;

const styles = StyleSheet.create({
  inputSection: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: hp(2),
  },

  label: {
    color: Colors.black,
    fontFamily: 'inter',
    fontWeight: '400',
    fontSize: FSize.fs14,
    paddingBottom: 5,
  },

  newlabel:{
    position:'relative',
    right:wp(32)
  },

  textInputSection: {
    paddingLeft: wp(1),
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:wp(1)
  },

  input: {
    width: '100%',
    padding: hp(1.5),
    borderWidth: 0,
    color: 'black',
    flexWrap: 'wrap',
  },

  inputSectionFocused: {
    borderWidth: 2,
  },

  imageStyle:{
    height:'100%',
    width:'100%',
    marginVertical:hp(1.5),
    tintColor:Colors.black
  }
});
