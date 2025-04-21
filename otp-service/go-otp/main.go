package main

import (
	"encoding/base32"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
)

type EnrollResponse struct {
	Secret string `json:"secret"`
	QRURI  string `json:"qr_uri"`
}

type VerifyRequest struct {
	Secret string `json:"secret"`
	Code   string `json:"code"`
}

type VerifyResponse struct {
	Valid bool `json:"valid"`
}

func enrollHandler(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user_id")
	b := make([]byte, 20)
	rand.Read(b)
	secret := base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(b)

	key, _ := otp.NewKeyFromURL(
		fmt.Sprintf("otpauth://totp/My2FAService:%s?secret=%s&issuer=My2FAService", user, secret))
	resp := EnrollResponse{Secret: secret, QRURI: key.URL()}
	json.NewEncoder(w).Encode(resp)
}

func verifyHandler(w http.ResponseWriter, r *http.Request) {
	var req VerifyRequest
	json.NewDecoder(r.Body).Decode(&req)
	valid := totp.Validate(req.Code, req.Secret)
	json.NewEncoder(w).Encode(VerifyResponse{Valid: valid})
}

func main() {
	rand.Seed(time.Now().UnixNano())
	http.HandleFunc("/enroll", enrollHandler)
	http.HandleFunc("/verify", verifyHandler)
	fmt.Println("Go OTP Service listening on http://localhost:4000")
	http.ListenAndServe(":4000", nil)
}
