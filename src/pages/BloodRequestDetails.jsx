import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bloodRequestService } from '../services/apiService'
import { toast } from 'react-toastify'

import {
  HiHeart,
  HiArrowLeft,
  HiClock,
  HiCheckCircle,
  HiExclamation,
  HiUser,
  HiOfficeBuilding,
  HiShieldCheck,
  HiCalendar,
  HiClipboardList,
  HiTrash,
  HiRefresh,
  HiInformationCircle
} from 'react-icons/hi'

const BloodRequestDetails = () => {
  const { id } = useParams()

  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    fetchRequest()
  }, [id])

  const fetchRequest = async () => {
    setLoading(true)

    try {
      const response = await bloodRequestService.getRequest(id)
      setRequest(response.data)
    } catch (error) {
      toast.error(
          error.response?.data?.message ||
          'Failed to fetch request details'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    if (
        !window.confirm(
            'Are you sure you want to cancel this blood request?'
        )
    ) {
      return
    }

    try {
      await bloodRequestService.cancelRequest(id)

      toast.success('Blood request cancelled successfully')

      navigate('/blood-requests')
    } catch (error) {
      toast.error(
          error.response?.data?.message ||
          'Failed to cancel request'
      )
    }
  }

  // ==========================================
  // FORMATTERS
  // ==========================================

  const formatBloodGroup = (bloodGroup) => {
    const groups = {
      A_POSITIVE: 'A+',
      A_NEGATIVE: 'A-',
      B_POSITIVE: 'B+',
      B_NEGATIVE: 'B-',
      AB_POSITIVE: 'AB+',
      AB_NEGATIVE: 'AB-',
      O_POSITIVE: 'O+',
      O_NEGATIVE: 'O-'
    }

    return groups[bloodGroup] || bloodGroup || '--'
  }

  const formatText = (value) => {
    if (!value) return '--'

    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending',
          description: 'Waiting for the request to be processed.',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: HiClock,
          dot: 'bg-amber-500'
        }

      case 'MATCHING':
        return {
          label: 'Matching',
          description: 'BloodLink is working to identify a suitable match.',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: HiRefresh,
          dot: 'bg-blue-500'
        }

      case 'ACCEPTED':
        return {
          label: 'Accepted',
          description: 'The request has been accepted.',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: HiCheckCircle,
          dot: 'bg-emerald-500'
        }

      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          description: 'The blood request is currently being processed.',
          bg: 'bg-violet-50',
          text: 'text-violet-700',
          border: 'border-violet-200',
          icon: HiRefresh,
          dot: 'bg-violet-500'
        }

      case 'COMPLETED':
        return {
          label: 'Completed',
          description: 'This blood request has been completed.',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: HiCheckCircle,
          dot: 'bg-emerald-500'
        }

      case 'CANCELLED':
        return {
          label: 'Cancelled',
          description: 'This blood request has been cancelled.',
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: HiExclamation,
          dot: 'bg-red-500'
        }

      case 'EXPIRED':
        return {
          label: 'Expired',
          description: 'The required time for this request has passed.',
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          icon: HiClock,
          dot: 'bg-slate-400'
        }

      default:
        return {
          label: formatText(status),
          description: 'Current request status.',
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          icon: HiInformationCircle,
          dot: 'bg-slate-400'
        }
    }
  }

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          label: 'Critical',
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          dot: 'bg-red-500'
        }

      case 'HIGH':
        return {
          label: 'High',
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          dot: 'bg-orange-500'
        }

      case 'NORMAL':
        return {
          label: 'Normal',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500'
        }

      default:
        return {
          label: formatText(priority),
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          dot: 'bg-slate-400'
        }
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

              <div className="h-7 w-7 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading request details...
            </p>

          </div>

        </div>
    )
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!request) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">

          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <HiExclamation className="text-3xl text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Request Not Found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              We couldn't find the blood request you're looking for.
            </p>

            <button
                onClick={() => navigate('/blood-requests')}
                className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Back to Requests
            </button>

          </div>

        </div>
    )
  }

  const status = getStatusConfig(request.status)
  const priority = getPriorityConfig(request.priority)

  const StatusIcon = status.icon

  const canCancel =
      request.status === 'PENDING' ||
      request.status === 'MATCHING'

  return (
      <div className="mx-auto max-w-6xl">

        {/* ==========================================
          HEADER
      =========================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <button
                onClick={() => navigate('/blood-requests')}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <HiArrowLeft className="text-xl" />
            </button>

            <div>

              <div className="flex items-center gap-2">

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                <HiHeart className="text-red-600" />
              </span>

                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                BloodLink
              </span>

              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Request Details
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Request #{request.requestId}
              </p>

            </div>

          </div>

          <button
              onClick={fetchRequest}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <HiRefresh />
            Refresh
          </button>

        </div>


        {/* ==========================================
          HERO
      =========================================== */}

        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 shadow-xl shadow-red-600/10">

          <div className="relative p-6 sm:p-8">

            {/* Decorative circles */}

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />

            <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* Blood */}

              <div className="flex items-center gap-5">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white text-3xl font-black text-red-600 shadow-xl">

                  {formatBloodGroup(request.bloodGroup)}

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-widest text-red-100">
                    Blood Required
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-white">
                    {request.unitsRequired} Unit
                    {request.unitsRequired !== 1 ? 's' : ''}
                  </h2>

                  <p className="mt-2 text-sm text-red-100">
                    {formatText(request.emergencyType)}
                  </p>

                </div>

              </div>


              {/* Status */}

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                <p className="text-xs font-medium text-red-100">
                  Current Status
                </p>

                <div className="mt-2 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">

                    <StatusIcon className={`text-xl ${status.text}`} />

                  </div>

                  <div>

                    <p className="font-bold text-white">
                      {status.label}
                    </p>

                    <p className="mt-0.5 text-xs text-red-100">
                      {status.description}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
          CONTENT GRID
      =========================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ======================================
            MAIN
        ======================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* Request Overview */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <HiClipboardList className="text-xl text-red-600" />
                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    Request Overview
                  </h2>

                  <p className="text-xs text-slate-400">
                    Important information about this request.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Request ID */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Request ID
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                    {request.requestId}
                  </p>

                </div>


                {/* Emergency */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Emergency Type
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {formatText(request.emergencyType)}
                  </p>

                </div>


                {/* Priority */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Priority
                  </p>

                  <div className="mt-2">

                  <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${priority.bg} ${priority.text} ${priority.border}`}
                  >

                    <span
                        className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                    />

                    {priority.label}

                  </span>

                  </div>

                </div>


                {/* Required By */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Required Before
                  </p>

                  <div className="mt-2 flex items-center gap-2">

                    <HiCalendar className="text-slate-400" />

                    <p className="text-sm font-semibold text-slate-800">

                      {request.requiredBefore
                          ? new Date(
                              request.requiredBefore
                          ).toLocaleDateString()
                          : 'N/A'}

                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* Patient / Hospital */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <HiUser className="text-xl text-blue-600" />
                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    Patient & Hospital
                  </h2>

                  <p className="text-xs text-slate-400">
                    Information associated with this request.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Patient */}

                <div className="flex items-start gap-4 rounded-xl border border-slate-100 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <HiUser className="text-lg text-blue-600" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Patient ID
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold text-slate-700">
                      {request.patientId}
                    </p>

                  </div>

                </div>


                {/* Hospital */}

                <div className="flex items-start gap-4 rounded-xl border border-slate-100 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                    <HiOfficeBuilding className="text-lg text-violet-600" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Hospital ID
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold text-slate-700">
                      {request.hospitalId}
                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* Reason */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <HiInformationCircle className="text-xl text-orange-600" />
                </div>

                <div>

                  <h2 className="font-bold text-slate-800">
                    Reason for Request
                  </h2>

                  <p className="text-xs text-slate-400">
                    Additional information provided with the request.
                  </p>

                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-sm leading-7 text-slate-600">
                  {request.reason || 'No additional reason provided.'}
                </p>

              </div>

            </section>

          </div>


          {/* ======================================
            SIDEBAR
        ======================================= */}

          <aside>

            <div className="sticky top-6 space-y-5">

              {/* Status Card */}

              <div className={`rounded-2xl border p-5 ${status.bg} ${status.border}`}>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">

                    <StatusIcon className={`text-xl ${status.text}`} />

                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-400">
                      Request Status
                    </p>

                    <p className={`mt-0.5 font-bold ${status.text}`}>
                      {status.label}
                    </p>

                  </div>

                </div>

                <p className={`mt-4 text-xs leading-5 ${status.text}`}>
                  {status.description}
                </p>

              </div>


              {/* Blood Summary */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <h3 className="font-bold text-slate-800">
                  Blood Requirement
                </h3>

                <div className="mt-5 flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white shadow-lg shadow-red-600/20">
                    {formatBloodGroup(request.bloodGroup)}
                  </div>

                  <div>

                    <p className="text-xl font-bold text-slate-800">
                      {request.unitsRequired} Unit
                      {request.unitsRequired !== 1 ? 's' : ''}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Blood required
                    </p>

                  </div>

                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">

                  <div className="flex items-center justify-between">

                  <span className="text-xs text-slate-400">
                    Blood group
                  </span>

                    <span className="text-sm font-bold text-red-600">
                    {formatBloodGroup(request.bloodGroup)}
                  </span>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                  <span className="text-xs text-slate-400">
                    Emergency
                  </span>

                    <span className="text-xs font-semibold text-slate-700">
                    {formatText(request.emergencyType)}
                  </span>

                  </div>

                </div>

              </div>


              {/* Deadline */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                    <HiClock className="text-xl text-orange-600" />
                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Required Before
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-800">

                      {request.requiredBefore
                          ? new Date(
                              request.requiredBefore
                          ).toLocaleString()
                          : 'Not specified'}

                    </p>

                  </div>

                </div>

              </div>


              {/* Security */}

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">

                    <HiShieldCheck className="text-xl text-emerald-600" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-emerald-800">
                      Secure Request
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-600">
                      Your request is securely stored in the
                      BloodLink system.

                    </p>

                  </div>

                </div>

              </div>


              {/* Cancel */}

              {canCancel ? (

                  <button
                      onClick={handleCancelRequest}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <HiTrash />
                    Cancel Request
                  </button>

              ) : (

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-center text-xs leading-5 text-slate-500">

                      This request can no longer be cancelled because
                      it is currently{' '}

                      <span className="font-semibold text-slate-700">
                    {formatText(request.status)}
                  </span>.

                    </p>

                  </div>

              )}

            </div>

          </aside>

        </div>

      </div>
  )
}

export default BloodRequestDetails