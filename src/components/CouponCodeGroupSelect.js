import React from "react";
import { Dropdown } from "semantic-ui-react";

export default function CouponCodeGroupSelect({
  onSelect,
  couponCodeGroups = []
}) {
  function handleChange(e, { value }) {
    onSelect(`|${value}|`);
  }

  return (
    <Dropdown
      button
      search
      text="Coupon Code"
      options={couponCodeGroups}
      className="mini"
      onChange={handleChange}
      value={null}
    ></Dropdown>
  );
}
