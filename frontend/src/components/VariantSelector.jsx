export default function VariantSelector({
  colors,
  storages,
  selectedColor,
  selectedStorage,
  onColorChange,
  onStorageChange,
}) {
  return (
    <div className="space-y-5">
      {/* Storage Options */}
      {storages && storages.length > 0 && (
        <div>
          <label className="text-[13px] font-semibold text-secondary block mb-2">
            Storage / Capacity
          </label>
          <div
            className="flex flex-wrap gap-2.5"
            role="radiogroup"
            aria-label="Storage capacity options"
          >
            {storages.map((s) => {
              const isSelected = selectedStorage === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStorageChange(s)}
                  role="radio"
                  aria-checked={isSelected}
                  className={`
                    px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 cursor-pointer border
                    ${
                      isSelected
                        ? "bg-accent text-white border-accent shadow-sm ring-2 ring-accent/20"
                        : "bg-white text-primary border-divider hover:border-accent/40 hover:bg-page-subtle"
                    }
                  `}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Finish Swatches */}
      {colors && colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[13px] font-semibold text-secondary">
              Finish: <span className="text-primary font-bold">{selectedColor}</span>
            </label>
          </div>

          <div
            className="flex items-center gap-3"
            role="radiogroup"
            aria-label="Color finish options"
          >
            {colors.map((c) => {
              const isSelected = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onColorChange(c.name)}
                  aria-label={c.name}
                  aria-checked={isSelected}
                  role="radio"
                  title={c.name}
                  className={`
                    w-8 h-8 rounded-full border transition-all duration-200 cursor-pointer relative p-0.5
                    ${
                      isSelected
                        ? "ring-2 ring-accent ring-offset-2 scale-110 border-transparent shadow-sm"
                        : "border-divider hover:scale-105 hover:border-accent/40"
                    }
                  `}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
