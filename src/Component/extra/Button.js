const Button = (props) => {
  const { newClass, btnColor, btnName, onClick, style, btnIcon, disabled , isImage  , isDeleted} = props;

  return (
    <button
      className={`themeBtn text-center ${newClass} ${btnColor}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {btnIcon ? (
        <>
        {
          isImage ?
          <img 
          src={btnIcon}
          style={{
       
           height: isDeleted ? 25 : 20,
           width:20
          }}
          /> 
          :
          <i className={`${btnIcon} text-dark`}></i>
        }
          <span className="ms-1 text-dark">{btnName}</span>
        </>
      ) : (
        btnName
      )}
    </button>
  );
};

export default Button;
