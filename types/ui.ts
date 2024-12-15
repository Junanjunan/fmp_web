export interface SelectProps {
    options: string[] | number[],
    value: string | number,
    onChange: (selected: string | number) => void,
    title: string,
    id: string,
}