import React from 'react';

export default function BillDetailsPage({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
