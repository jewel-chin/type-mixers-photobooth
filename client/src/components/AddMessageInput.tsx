type Props = {
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
};

export const AddMessageInput: React.FC<Props> = ({
  customText,
  setCustomText,
}) => {
  return (
    <>
      <label className="text-[0.6em] font-bold uppercase opacity-60">
        Add Message:
      </label>

      <input
        type="text"
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        placeholder="Type here..."
        className="text-[0.6em] bg-cream text-dark-brown p-1 text-sm tracking-normal rounded border border-gray-600"
      />
    </>
  );
};
