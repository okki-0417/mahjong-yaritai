# frozen_string_literal: true

RSpec.shared_examples :valid do |status|
  it "バリデーションが通ること" do
    expect(subject.valid?).to eq true
  end
end

RSpec.shared_examples :invalid do |status|
  it "バリデーションが通らないこと" do
    expect(subject.valid?).to eq false
  end
end

RSpec.shared_examples :error_added do |attribute, type, options = {}|
  it "エラーが追加されていること" do
    subject.valid?
    expect(subject.errors).to be_added(attribute, type, **options)
  end
end
