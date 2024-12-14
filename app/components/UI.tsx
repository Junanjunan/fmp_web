export const CheckboxList = ({ attributes, title }: { attributes: string[], title: string }) => {
  return (
    <div>
      <div>{title}</div>
      <div className="flex space-x-4 flex-wrap">
        {attributes.map((attribute) => {
          return (
            <div key={attribute}>
              <input type="checkbox" id={attribute} name={attribute} />
              <label htmlFor={attribute}>{attribute}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};