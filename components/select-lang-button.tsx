import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

import { languages } from "@/constants/language";
import { SelectLangButtonprops } from "@/constants/types/props";




const SelectLangButton = ({value, onChange}: SelectLangButtonprops) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang)=>
            <SelectItem key={lang.code} value={lang.code}>{lang.label}</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectLangButton;
