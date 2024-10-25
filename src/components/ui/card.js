import React from 'react';

export const Card = ({ children }) => {
  return <div className="border rounded shadow p-4">{children}</div>;
};

export const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

export const CardHeader = ({ children }) => {
  return <div className="border-b p-2 font-bold">{children}</div>;
};

export const CardTitle = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};
