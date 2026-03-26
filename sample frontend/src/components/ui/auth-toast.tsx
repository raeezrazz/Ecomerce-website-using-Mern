type AuthToastProps = {
  title: string;
  description?: string;
  type?: 'success' | 'error';
};

export function AuthToast({ title, description, type = 'success' }: AuthToastProps) {
  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`min-w-[250px] max-w-sm rounded-lg shadow-lg p-4 text-white transition-all duration-300 ${
          type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        <h4 className="font-semibold">{title}</h4>
        {description && <p className="text-sm mt-1">{description}</p>}
      </div>
    </div>
  );
}
