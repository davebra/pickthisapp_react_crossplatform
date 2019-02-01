import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  ScrollView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewPropTypes as RNViewPropTypes
} from 'react-native';
import { Text, Item, Label, Input } from 'native-base';
import Colors from '../constants/Colors';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

class Autocomplete extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    containerStyle: ViewPropTypes.style,
    data: PropTypes.array,
    hideResults: PropTypes.bool,
    inputContainerStyle: ViewPropTypes.style,
    keyboardShouldPersistTaps: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    listContainerStyle: ViewPropTypes.style,
    onShowResults: PropTypes.func,
    onStartShouldSetResponderCapture: PropTypes.func,
    renderItem: PropTypes.func,
    renderSeparator: PropTypes.func,
    renderTextInput: PropTypes.func,
    flatListProps: PropTypes.object,
  };

  static defaultProps = {
    data: [],
    defaultValue: '',
    keyboardShouldPersistTaps: 'always',
    onStartShouldSetResponderCapture: () => false,
    renderItem: ({ item }) => <Text>{item}</Text>,
    renderSeparator: null,
    renderTextInput: props => (
      <Item floatingLabel>
        <Label>Type a tag...</Label>
        <Input {...props} />
      </Item>
      ),
    flatListProps: {},
  };

  constructor(props) {
    super(props);

    this.state = { data: props.data };

    this.resultList = null;
    this.textInput = null;

    this.onRefListView = this.onRefListView.bind(this);
    this.onRefTextInput = this.onRefTextInput.bind(this);
  }

  componentWillReceiveProps({ data }) {
    this.setState({ data });
  }

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  blur() {
    const { textInput } = this;
    textInput && textInput.blur();
  }

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  focus() {
    const { textInput } = this;
    textInput && textInput.focus();
  }

  onRefListView(resultList) {
    this.resultList = resultList;
  }

  renderResultList() {
    const { data } = this.state;
    const {
      renderItem,
      renderSeparator,
      keyboardShouldPersistTaps,
      flatListProps
    } = this.props;

    return (
      <FlatList
        ref={this.onRefListView}
        data={data}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        //renderSeparator={renderSeparator}
        style={styles.list}
        {...flatListProps}
      />
    );
  }

  onRefTextInput(textInput) {
    this.textInput = textInput
  }

  renderTextInput() {
    const { onEndEditing, renderTextInput, style } = this.props;
    const props = {
      style: [styles.input, style],
      ref: this.onRefTextInput,
      onEndEditing: e => onEndEditing && onEndEditing(e),
      ...this.props
    };

    return renderTextInput(props);
  }

  render() {
    const { data } = this.state;
    const {
      containerStyle,
      hideResults,
      inputContainerStyle,
      listContainerStyle,
      onShowResults,
      onStartShouldSetResponderCapture
    } = this.props;
    const showResults = data.length > 0;

    // Notify listener if the suggestion will be shown.
    onShowResults && onShowResults(showResults);

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {this.renderTextInput()}
        </View>
        {!hideResults && (
          <View
            style={listContainerStyle}
            onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
          >
            {showResults && this.renderResultList()}
          </View>
        )}
      </View>
    );
  }
}

const androidStyles = {
  container: {
    flex: 1
  },
  inputContainer: {
    marginBottom: 0
  },
  list: {
    backgroundColor: Colors.lightColor,
    margin: 0,
  }
};

const iosStyles = {
  container: {
    zIndex: 1
  },
  inputContainer: {
    marginBottom: 0
  },
  list: {
    backgroundColor: Colors.lightColor,
    left: 0,
    position: 'absolute',
    right: 0
  }
};

const styles = StyleSheet.create({
  ...Platform.select({
    android: { ...androidStyles },
    ios: { ...iosStyles }
  })
});

export default Autocomplete;