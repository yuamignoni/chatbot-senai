interface LinkMenuPrimaryProps {
  idSection: string;
  name: string;
}

function LinkMenuPrimary({ idSection, name }: LinkMenuPrimaryProps) {
  return (
    <a href={`#${idSection}`}>{name}</a>
  );
}

export default LinkMenuPrimary;