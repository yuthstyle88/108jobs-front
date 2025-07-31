import React, {ReactNode} from "react";

export function interpolateElement(
  template: string,
  values: Record<string, ReactNode>
): ReactNode[] {
  const parts = template.split(/(\{\{\w+\}\})/g); // tách giữa text và placeholder

  return parts.map((part, index) => {
    const match = part.match(/^\{\{(\w+)\}\}$/);
    if (match) {
      const key = match[1];
      return <React.Fragment key={index}>{values[key] ?? ""}</React.Fragment>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
