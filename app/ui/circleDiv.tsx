function CircleDiv({
  className,
  height,
  width,
  imgSrc,
}: {
  className: string;
  height: string;
  width: string;
  imgSrc: string | undefined;
}) {
  if (!imgSrc) {
    return (
      <div
        className={`${height} ${width} ${className} rounded-full bg-slate-200`}
      ></div>
    );
  }
  return (
    <div
      className={`${height} ${width} ${className} rounded-full bg-slate-200`}
    >
      <img src={imgSrc} alt="profile" className="rounded-full w-full h-full" />
    </div>
  );
}

export default CircleDiv;
