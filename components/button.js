import React from "react";
import classNames from "classnames";

export default function Button(props) {
  const { className, isActive, ...otherProps } = props;

  return (
    <>
      <button
        className={classNames(
          className,
          isActive && "active",
          "border border-gray-400 px-4 py-2 rounded hover:shadow"
        )}
        {...otherProps}
      />
    </>
  );
}
