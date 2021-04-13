import react from "react";
import { ToastContainer, toast } from "react-toastify";

// Hight Order Component (HOC) for extends common methods  like showMessage
const WithMessage = (Component) => {
  var msg = ""
  return class extends react.Component {
    showMessage = (message, type = "info") => {
     if(message !== msg){
      toast(message, {type });
      msg = message
     }
    };

    render() {
      return (
        <>
          <Component showMessage={this.showMessage} {...this.props}/>
          <ToastContainer
            closeOnClick
            position="bottom-right"
            autoClose={1500}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
      );
    }
  };
};
export default WithMessage;
