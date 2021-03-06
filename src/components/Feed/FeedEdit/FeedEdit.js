import React, { Component, Fragment } from "react";

import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal";
import Input from "../../Form/Input/Input";
import { required, length } from "../../../util/validators";
import { generateBase64FromImage } from "../../../util/image";

const POST_FORM = {
  title: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  content: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  phone: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 10 })],
  },
  insterestLevel: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 1 })],
  },
};

class FeedEdit extends Component {
  state = {
    postForm: POST_FORM,
    formIsValid: false,
    imagePreview: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedPost !== this.props.selectedPost
    ) {
      const postForm = {
        title: {
          ...prevState.postForm.title,
          value: this.props.selectedPost.title,
          valid: true,
        },
        content: {
          ...prevState.postForm.content,
          value: this.props.selectedPost.content,
          valid: true,
        },
        phone: {
          ...prevState.postForm.phone,
          value: this.props.selectedPost.phone,
          valid: true,
        },
        insterestLevel: {
          ...prevState.postForm.insterestLevel,
          value: this.props.selectedPost.insterestLevel,
          valid: true,
        },
      };
      this.setState({ postForm: postForm, formIsValid: true });
    }
  }

  postInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then((b64) => {
          this.setState({ imagePreview: b64 });
        })
        .catch((e) => {
          this.setState({ imagePreview: null });
        });
    }
    this.setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.postForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.postForm,
        [input]: {
          ...prevState.postForm[input],
          valid: isValid,
          value: files ? files[0] : value,
        },
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        postForm: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  inputBlurHandler = (input) => {
    this.setState((prevState) => {
      return {
        postForm: {
          ...prevState.postForm,
          [input]: {
            ...prevState.postForm[input],
            touched: true,
          },
        },
      };
    });
  };

  cancelPostChangeHandler = () => {
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
    });
    this.props.onCancelEdit();
  };

  acceptPostChangeHandler = () => {
    const post = {
      title: this.state.postForm.title.value,
      content: this.state.postForm.content.value,
      phone: this.state.postForm.phone.value,
      insterestLevel: this.state.postForm.insterestLevel.value,
    };
    this.props.onFinishEdit(post);
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
      imagePreview: null,
    });
  };

  render() {
    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelPostChangeHandler} />
        <Modal
          title={this.state.postForm["title"].value}
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelPostChangeHandler}
          onAcceptModal={this.acceptPostChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="title"
              label="Title"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "title")}
              valid={this.state.postForm["title"].valid}
              touched={this.state.postForm["title"].touched}
              value={this.state.postForm["title"].value}
            />
            <Input
              id="content"
              label="Details"
              control="textarea"
              rows="5"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "content")}
              valid={this.state.postForm["content"].valid}
              touched={this.state.postForm["content"].touched}
              value={this.state.postForm["content"].value}
            />
            <Input
              id="phone"
              label="Phone"
              control="textarea"
              rows="1"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "phone")}
              valid={this.state.postForm["phone"].valid}
              touched={this.state.postForm["phone"].touched}
              value={this.state.postForm["phone"].value}
            />
            <Input
              id="insterestLevel"
              label="Interest Level"
              control="textarea"
              rows="1"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "insterestLevel")}
              valid={this.state.postForm["insterestLevel"].valid}
              touched={this.state.postForm["insterestLevel"].touched}
              value={this.state.postForm["insterestLevel"].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default FeedEdit;
