class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
  before_action :authenticate_user!

  before_filter :configure_permitted_parameters, if: :devise_controller?


  def after_sign_in_path_for resource
    "/map"
  end

  def after_sign_up_path_for resource
    "/map"
  end

  def after_sign_out_path_for resource
    p "hoge"
    "/users/sign_in"
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :name 
  end

  private 

  def require_login_user 
    unless user_signed_in?
      redirect_to "/users/signed_in"
    end
  end

end
