export type Role = {
  id: number
  name: string
  description: string | null
  created_at: string
}

export type User = {
  id: number
  staff_id: string
  full_name: string
  role_id: number
  is_active: boolean
  created_at: string
  roles?: Role
}

export type ProductionLine = {
  id: number
  line_code: string
  axle_type: 'FRONT' | 'REAR'
  description: string | null
  is_active: boolean
  created_at: string
}

export type AxleModel = {
  id: number
  line_id: number
  model_code: string
  model_name: string
  is_active: boolean
  created_at: string
  production_lines?: ProductionLine
}

export type TighteningPoint = {
  id: number
  model_id: number
  point_code: string
  point_name: string
  tool_type: 'NUTRUNNER' | 'ACLS'
  sequence_order: number
  torque_min: number | null
  torque_max: number | null
  torque_unit: string
  is_active: boolean
}

export type Shift = {
  id: number
  line_id: number
  shift_date: string
  shift_code: string
  started_at: string | null
  closed_at: string | null
  status: 'OPEN' | 'CLOSED'
  created_at: string
  production_lines?: ProductionLine
}

export type OperatorSession = {
  id: number
  shift_id: number
  user_id: number
  login_at: string
  logout_at: string | null
  created_at: string
  users?: User
}

export type WipAssembly = {
  id: number
  shift_id: number
  model_id: number
  operator_id: number
  wip_barcode: string
  status: 'IN_PROGRESS' | 'PENDING_QC' | 'PASSED' | 'FAILED' | 'REWORK'
  started_at: string
  completed_at: string | null
  qc_user_id: number | null
  qc_result: 'PASS' | 'FAIL' | null
  qc_remark: string | null
  qc_at: string | null
  created_at: string
  axle_models?: AxleModel
  users?: User
}

export type SubComponent = {
  id: number
  wip_id: number
  component_type: string
  serial_number: string | null
  lot_number: string | null
  scan_result: 'OK' | 'NG'
  scanned_at: string
  scanned_by: number
}

export type TorqueResult = {
  id: number
  wip_id: number
  tightening_point_id: number
  tool_type: 'NUTRUNNER' | 'ACLS'
  actual_value: number | null
  torque_min: number | null
  torque_max: number | null
  signal_result: 'OK' | 'NG'
  final_result: 'OK' | 'NG'
  sequence_no: number
  recorded_at: string
  tightening_points?: TighteningPoint
}

export type NcrRecord = {
  id: number
  wip_id: number
  torque_result_id: number | null
  ncr_type: 'TORQUE_NG' | 'SUBCOMPONENT_NG' | 'QC_FAIL' | 'OTHER'
  defect_description: string
  disposition: 'REWORK' | 'SCRAP' | 'USE_AS_IS' | 'PENDING'
  raised_by: number
  approved_by: number | null
  raised_at: string
  closed_at: string | null
  remark: string | null
  created_at: string
}
