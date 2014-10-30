class UserBlock < ActiveRecord::Base

  def self.add_user_block user_id,stageNum
    Block.where(stage_id: stageNum).each {|block|
      UserBlock.create(user_id: user_id, block_id: block.id)
    }
  end

  def self.get_user_blocks current_user_id
    user_blocks = UserBlock.where(:user_id=>current_user_id)
    return user_blocks
  end
end
