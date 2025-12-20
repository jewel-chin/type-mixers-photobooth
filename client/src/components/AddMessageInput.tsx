type Props = {
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
};

export const AddMessageInput: React.FC<Props> = ({
  customText,
  setCustomText,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm">Add Message:</label>
      <input
        type="text"
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        placeholder="Type here..."
        className="text-[0.6em] bg-cream text-dark-brown p-1 text-sm tracking-normal rounded border border-gray-600"
      />
    </div>
  );
};
