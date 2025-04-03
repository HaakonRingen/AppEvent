// src/services/profileService.ts
export const updateUserProfile = async (token: string, aboutMe: string) => {
    try {
      const res = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aboutMe }),
      });
  
      if (!res.ok) throw new Error("Failed to update profile");
      return await res.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
  
  export const unregister = async (token: string, eventId: string) => {
    try {
      const res = await fetch("/api/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
  
      if (!res.ok) throw new Error("Failed to unregister");
      return await res.json();
    } catch (error) {
      console.error("Error unregistering from event:", error);
      throw error;
    }
  };
  