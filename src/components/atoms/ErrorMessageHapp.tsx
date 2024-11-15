interface Props {
  children: string;
}

export default function ErrorMessageHapp({ children }: Props) {
  return <p className="mt-1 font-light text-red-500 text-xs">⚠ {children}</p>;
}