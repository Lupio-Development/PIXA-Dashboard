import swal from "sweetalert";

export const alert = (title: string, data: string, type: string) => {
  return swal(title, data, type);
};

export const warning : any = (buttons : any): Promise<boolean> => {
  return swal({
    title: "Are You Sure!",
    icon: "warning",
    dangerMode: true,
    buttons: buttons ||  true,
  });
};

// Delete Warning for category
export const warningForText = (text: string): Promise<boolean> => {
  return swal({
    title: "Are You Sure!",
    text: text,
    icon: "warning",
    dangerMode: true,
    // buttons: true,
  });
};

// For Permission
export const warningForAccept: any = (text,buttons: any): Promise<boolean> => {
  return swal({
    title: `Would you like to accept ${text}  request!`,
    icon: "warning",
    dangerMode: true,
    buttons: buttons || true,
  });
};
