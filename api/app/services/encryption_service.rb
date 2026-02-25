class EncryptionService
  class << self
    def encrypt(data)
      encryptor.encrypt_and_sign(data)
    end

    def decrypt(encrypted_data)
      encryptor.decrypt_and_verify(encrypted_data)
    end

    private

    def encryptor
      @encryptor ||= begin
        key_len = ActiveSupport::MessageEncryptor.key_len
        secret = Rails.application.key_generator.generate_key("encryption_service", key_len)

        ActiveSupport::MessageEncryptor.new(secret)
      end
    end
  end
end
