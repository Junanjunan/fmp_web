export const CheckboxList = ({ attributes }: { attributes: string[] }) => {
  return (
    <div className="flex space-x-4">
      {attributes.map((attribute) => {
        return (
          <div key={attribute}>
            <input type="checkbox" id={attribute} name={attribute} />
            <label htmlFor={attribute}>{attribute}</label>
          </div>
        );
      })}
    </div>
  );
};