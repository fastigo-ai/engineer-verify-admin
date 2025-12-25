const API_BASE_URL = "https://engineer-xkt8.onrender.com";
// const API_BASE_URL = "http://localhost:8000";

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("admin_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || "Request failed");
    }

    return response.json();
  }

  // Auth endpoints - OTP based (uses /auth/register for admin bypass)
  async sendOtp(mobile: string) {
    return this.request<{ identifier: string; is_new_user: boolean; message: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ mode: "mobile", mobile }),
      }
    );
  }

  async verifyOtp(identifier: string, otp: string) {
    const response = await this.request<{ access_token: string }>(
      "/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({ identifier, otp }),
      }
    );
    this.setToken(response.access_token);
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Admin endpoints
  async getAdminHome() {
    return this.request<{ message: string }>("/admin/");
  }

 async getEngineers() {
    return this.request<any[]>("/admin/engineers");
  }

  async getEngineerDetails(userId: string) {
    return this.request<{
      user: { id: string; email: string; role: string };
      profile: { id: string; name: string; phone: string; status: string } | null;
      kyc: {
        id: string;
        status: string;
        remarks: string | null;
        photo_file: string | null;
        address_proof_file: string | null;
      } | null;
      bank: {
        id: string;
        status: string;
        remarks: string | null;
        proof_file: string | null;
      } | null;
    }>(`/admin/engineers/${userId}`);
  }

  async approveEngineer(userId: string) {
    return this.request<{ message: string; external_response?: any }>(
      `/admin/engineers/${userId}/approve`,
      { method: "POST" }
    );
  }

  async rejectEngineer(userId: string, remarks?: string) {
    const params = new URLSearchParams();
    if (remarks) params.append("remarks", remarks);
    
    return this.request<{ message: string }>(
      `/admin/engineers/${userId}/reject${remarks ? `?${params}` : ""}`,
      { method: "POST" }
    );
  }

  async updateKycStatus(userId: string, status: "approved" | "rejected", remarks?: string) {
    const params = new URLSearchParams();
    params.append("status", status);
    if (remarks) params.append("remarks", remarks);
    
    return this.request<{ message: string }>(
      `/admin/kyc/${userId}/status?${params}`,
      { method: "POST" }
    );
  }

  async updateBankStatus(userId: string, status: "approved" | "rejected", remarks?: string) {
    const params = new URLSearchParams();
    params.append("status", status);
    if (remarks) params.append("remarks", remarks);
    
    return this.request<{ message: string }>(
      `/admin/bank/${userId}/status?${params}`,
      { method: "POST" }
    );
  }
}

export const api = new ApiClient();
