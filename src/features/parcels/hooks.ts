import useAxiosSecure from "../../hooks/useAxiosSecure";

interface LogTrackingParams {
  trackingId: string;
  status: string;
  details: string;
  location?: string;
  updated_by: string;
}

export const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();
  
  const logTracking = async ({ trackingId, status, details, location, updated_by }: LogTrackingParams) => {
    try {
      const payload = {
        trackingId,
        status,
        details,
        location,
        updated_by
      };
      await axiosSecure.post('/trackings', payload);
    } catch (error) {
      console.error('Error logging tracking update:', error);
    }
  };

  return { logTracking };
};
