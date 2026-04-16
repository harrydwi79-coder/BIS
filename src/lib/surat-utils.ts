/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BRANCH_CODES, DEPT_CODES, getRomanMonth } from '../constants';

export function generateNomorSurat(
  branchName: string,
  deptName: string,
  sequence: number
): string {
  const branchCode = BRANCH_CODES[branchName] || '0';
  const deptCode = DEPT_CODES[deptName] || 'STG.GEN';
  const now = new Date();
  const romanMonth = getRomanMonth(now.getMonth());
  const year = now.getFullYear();

  // Format: [BranchCode][Sequence]/[DeptCode]-BSM/[RomanMonth]/[Year]
  // Example: 1371/STG.HCGS-FAT-BSM/V/2025
  // Note: User example had STG.HCGS-FAT, but mapping says STG.HC for HCGS.
  // We will use the mapping provided.
  
  const fullSequence = `${branchCode}${sequence}`;

  return `${fullSequence}/${deptCode}-BSM/${romanMonth}/${year}`;
}
