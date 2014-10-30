class Users::RegistrationsController < Devise::RegistrationsController
 
  def new
    super
  end
 
  def create
    super
    UserBlock.add_user_block(current_user.id,0)
  end
 
end
