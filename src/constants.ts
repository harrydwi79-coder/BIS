/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BRANCH_CODES: Record<string, string> = {
  'Jakarta': '1',
  'Samarinda': '2',
  'Kendari': '3',
  'Palembang': '4',
  'Banjarmasin': '5',
};

export const DEPT_CODES: Record<string, string> = {
  'Finance': 'STG.FAT',
  'Sales': 'STG.SLS',
  'Service': 'STG.SVC',
  'HCGS': 'STG.HC',
  'Administrasi': 'STG.ADM',
  'Sparepart': 'STG.PART',
  'Parts': 'STG.PART', // Alias for Sparepart
};

export const ROMAN_MONTHS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 
  'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
];

export function getRomanMonth(monthIndex: number): string {
  return ROMAN_MONTHS[monthIndex];
}
