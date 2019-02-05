import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes as RNViewPropTypes } from 'react-native';
import { Text, Item, Label, Input } from 'native-base';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

class Autocomplete extends Component {
  static propTypes = {
    ...Input.propTypes,
    data: PropTypes.array,
    hideResults: PropTypes.bool,
    inputContainerStyle: ViewPropTypes.style,
    keyboardShouldPersistTaps: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    onShowResults: PropTypes.func,
    onStartShouldSetResponderCapture: PropTypes.func,
    renderItem: PropTypes.func,
    renderTextInput: PropTypes.func,
  };

  static defaultProps = {
    data: [],
    defaultValue: '',
    keyboardShouldPersistTaps: 'always',
    onStartShouldSetResponderCapture: () => false,
    renderItem: ({ item }) => <Text>{item}</Text>,
    renderTextInput: props => (<Input {...props} />),
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

  clear() {
    this.textInputRef._root.clear();
  }

  onRefListView(resultList) {
    this.resultList = resultList;
  }

  renderResultList() {
    const { data } = this.state;
    const { renderItem } = this.props;

    return (
      <View style={{
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}>
        {data.map( (item, i) => renderItem(item, i) )}
      </View>
    );
  }

  onRefTextInput(textInput) {
    this.textInput = textInput
  }

  renderTextInput() {
    const { onEndEditing, renderTextInput, style } = this.props;
    const props = {
      style: [style],
      ref: input => { this.textInputRef = input },
      onEndEditing: e => onEndEditing && onEndEditing(e),
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: false,
      ...this.props
    };

    return renderTextInput(props);
  }

  render() {
    const { data } = this.state;
    const {
      hideResults,
      onShowResults,
      onStartShouldSetResponderCapture
    } = this.props;
    const showResults = data.length > 0;

    // Notify listener if the suggestion will be shown.
    onShowResults && onShowResults(showResults);

    return (
      <View>
        <Item stackedLabel>
          <Label>Add some tags...</Label>
          {this.renderTextInput()}
        </Item>
        {!hideResults && (
          <View
            onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
          >
            {showResults && this.renderResultList()}
          </View>
        )}
      </View>
    );
  }
}

export default Autocomplete;