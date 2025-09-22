import swal from "sweetalert";

export const alert = (title, data, type) => {
  return swal(title, data, type);
};

export const warning = () => {
  return swal({
    title: "Are You Sure!",
    icon: "warning",
    dangerMode: true,
    buttons: true,
  });
};

export const warningAccept = () => {
  return swal({
    title: "Would you like to approve the seller request?",
    icon: "warning",
    dangerMode: true,
    buttons: true,
  });
};

//Delete Warning for category
export const  warningForText = async (text) => {
  const result = await  swal({
    title: "Are You Sure!",
    text: text,
    icon: "warning",
    dangerMode: true,
    buttons: true,
  });
  
  return result
};



export const warningPay = () => {
  return swal({
    title: "Are You Want Sure Paid !",
    icon: "warning",
    dangerMode: true,
    buttons: true,
  });
};
