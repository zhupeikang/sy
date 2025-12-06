import { defineStore } from 'pinia';

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    // Structure: { [componentId]: { [type]: value } }
    selectedValues: {} as Record<string, Record<string, string | number>>,
  }),
  actions: {
    selectOption(componentId: string, type: string, value: string | number) {
      // Reset the type-value pair for the componentId
      this.selectedValues[componentId] = { [type]: value };
    },
    getDisabledOptions(excludeComponentId: string) {
      // Retrieve values of all types from components excluding the specified componentId
      return Object.entries(this.selectedValues)
        .filter(([id]) => id !== excludeComponentId)
        .flatMap(([, types]) => Object.values(types));
    },
    removeOption(componentId: string, type?: string) {
      if (this.selectedValues[componentId]) {
        if (type) {
          // Remove only the specified type's value
          const { [type]: _, ...rest } = this.selectedValues[componentId];
          this.selectedValues[componentId] = rest;

          // Delete the component if it has no remaining types
          if (Object.keys(this.selectedValues[componentId]).length === 0) {
            delete this.selectedValues[componentId];
          }
        } else {
          // Remove the entire component
          delete this.selectedValues[componentId];
        }
      }
    },
    clearAll() {
      // Clear all selected values
      this.selectedValues = {};
    },
  },
});



